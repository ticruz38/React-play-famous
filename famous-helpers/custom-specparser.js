/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
var Transform = require('./Transform');

function SpecParser() {
    this.result = {};
}
SpecParser._instance = new SpecParser();
SpecParser.parse = function parse(spec, context) {
    return SpecParser._instance.parse(spec, context);
};
SpecParser.prototype.parse = function parse(spec, context) {
    this.reset();
    this._parseSpec(spec, context, Transform.identity);
    return this.result;
};
SpecParser.prototype.reset = function reset() {
    this.result = {};
};

function _vecInContext(v, m) {
    return [
        v[0] * m[0] + v[1] * m[4] + v[2] * m[8],
        v[0] * m[1] + v[1] * m[5] + v[2] * m[9],
        v[0] * m[2] + v[1] * m[6] + v[2] * m[10]
    ];
}
var _zeroZero = [
    0,
    0
];
SpecParser.prototype._parseSpec = function _parseSpec(spec, parentContext, sizeContext, extraState) {
    var id;
    var target;
    var transform;
    var opacity;
    var origin;
    var align;
    var size;
    var state;
    if (typeof spec === 'number') {
        //console.log('number', spec);
        id = spec;
        transform = parentContext.transform;
        align = parentContext.align || _zeroZero;
        if (parentContext.size && align && (align[0] || align[1])) {
            console.log('align');
            var alignAdjust = [
                align[0] * parentContext.size[0],
                align[1] * parentContext.size[1],
                0
            ];
            transform = Transform.thenMove(transform, _vecInContext(alignAdjust, sizeContext));
        }
        state = {
            transform: transform,
            opacity: parentContext.opacity,
            origin: parentContext.origin || _zeroZero,
            align: parentContext.align || _zeroZero,
            size: parentContext.size
        };
        if (extraState) {
            for (var key in extraState) {
                state[key] = extraState[key];
            }
        }
        this.result[id] = state;
    } else if (!spec) {
        return;
    } else if (spec instanceof Array) {
        for (var i = 0; i < spec.length; i++) {
            this._parseSpec(spec[i], parentContext, sizeContext);
        }
    } else {
        target = spec.target;
        var state = {};
        var extraState = {};
        var transform = parentContext.transform;
        var opacity = parentContext.opacity;
        var origin = parentContext.origin;
        var align = parentContext.align;
        var size = parentContext.size;
        console.log(align);
        var nextSizeContext = sizeContext;

        for (var key in spec) {
            if (key === 'opacity') {
                opacity = parentContext[key] * spec[key];
            } else if (key === 'transform') {
                transform = Transform.multiply(parentContext[key], spec[key]);
            } else if (key === 'origin') {
                origin = spec[key];
                nextSizeContext = parentContext.transform;
            } else if (key === 'align') {
                align = spec[key];
            } else if (key === 'size' || key === 'proportions') {
                var parentSize = size;
                size = [
                    size[0],
                    size[1]
                ];
                if (key === 'size' && spec.size) {
                    if (spec[key][0] !== undefined)
                        size[0] = spec[key][0];
                    if (spec[key][1] !== undefined)
                        size[1] = spec[key][1];
                }
                if (key === 'proportions') {
                    console.log('proportions');
                    if (spec[key][0] !== undefined)
                        size[0] = size[0] * spec[key][0];
                    if (spec[key][1] !== undefined)
                        size[1] = size[1] * spec[key][1];
                }
                if (parentSize) {
                    if (align && (align[0] || align[1])) {
                        console.log('align');
                        transform = Transform.thenMove(transform, _vecInContext([
                            align[0] * parentSize[0],
                            align[1] * parentSize[1],
                            0
                        ], sizeContext));
                    }
                    if (origin && (origin[0] || origin[1])) {
                        console.log('origin');
                        transform = Transform.moveThen([-origin[0] * size[0], -origin[1] * size[1],
                            0
                        ], transform);
                    }
                }
            } else if (key !== 'target' && key !== 'initialize') {
                state[key] = spec[key];
                extraState[key] = spec[key];
            }

            nextSizeContext = parentContext.transform;
            state.transform = transform;
            state.opacity = opacity;
            state.align = null;
            state.origin = origin;
            //state.origin = null;
            //state.align = null;
            state.size = size;
        }

        this._parseSpec(target, state, nextSizeContext, extraState);
    }
};
module.exports = SpecParser;
