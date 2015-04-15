var SCALE = 50;
var MAX_X = 10 * SCALE + 40 + 200;
var MAX_Y = 18 * SCALE * Math.sin(Raphael.rad(30)) + 40;
var STONE_RADIUS = 20;
var RADIUS = 7;

var r;
var stones = {};
var coords = {};

var pos = {
    'a1': [1,5], 'a2': [1,7], 'a3': [1,9], 'a4': [1,11], 'a5': [1,13],
    'b1': [2,4], 'b2': [2,6], 'b3': [2,8], 'b4': [2,10], 'b5': [2,12], 'b6': [2,14],
    'c1': [3,3], 'c2': [3,5], 'c3': [3,7], 'c4': [3,9],  'c5': [3,11], 'c6': [3,13], 'c7': [3,15],
    'd1': [4,2], 'd2': [4,4], 'd3': [4,6], 'd4': [4,8],  'd5': [4,10], 'd6': [4,12], 'd7': [4,14], 'd8': [4,16],
    'e1': [5,1], 'e2': [5,3], 'e3': [5,5], 'e4': [5,7],  'e5': [5,9],  'e6': [5,11], 'e7': [5,13], 'e8': [5,15], 'e9': [5,17],
    'f1': [6,2], 'f2': [6,4], 'f3': [6,6], 'f4': [6,8],  'f5': [6,10], 'f6': [6,12], 'f7': [6,14], 'f8': [6,16],
    'g1': [7,3], 'g2': [7,5], 'g3': [7,7], 'g4': [7,9],  'g5': [7,11], 'g6': [7,13], 'g7': [7,15],
    'h1': [8,4], 'h2': [8,6], 'h3': [8,8], 'h4': [8,10], 'h5': [8,12], 'h6': [8,14],
    'i1': [9,5], 'i2': [9,7], 'i3': [9,9], 'i4': [9,11], 'i5': [9,13],
    'reserve_white': [1,1], 'reserve_black': [9,1]
};

var pos_reserve = {
    1: [1,1], 2: [2,1], 3: [2,1],
}

for (var key in pos) {
    var x = pos[key][0]*SCALE+ 20 +100;
    var y = MAX_Y - pos[key][1]*SCALE*Math.sin(Raphael.rad(30)) - 20;
    coords[key] = [x,y];
}

var lines = [
    //nw -> se
    ['a2','f1'], ['a3','g1'], ['a4','h1'], ['a5','i1'], ['b6','i2'], ['c7','i3'], ['d8','i4'],
    //se-> nw
    ['a4','f8'], ['a3','g7'], ['a2','h6'], ['a1','i5'], ['b1','i4'], ['c1','i3'], ['d1','i2'],
    // s -> n
    ['b1','b6'], ['c1','c7'], ['d1','d8'], ['e1','e9'], ['f1','f8'], ['g1','g7'], ['h1','h6']
];
var border_points = {
    'a1': ['ne'], 'a2': ['ne', 'se'], 'a3': ['ne', 'se'], 'a4': ['ne', 'se'], 'a5': ['se'],
    'b1': ['n', 'ne'], 'c1': ['n', 'ne'], 'd1': ['n', 'ne'], 'e1': ['n'], 'f1': ['n', 'nw'], 'g1': ['n', 'nw'], 'h1': ['n', 'nw'],
    'i1': ['nw'], 'i2': ['sw', 'nw'], 'i3': ['sw', 'nw'], 'i4': ['sw', 'nw'], 'i5': ['sw'],
    'h6': ['s', 'sw'], 'g7': ['s', 'sw'], 'f8': ['s', 'sw'], 'e9': ['s'], 'd8': ['s', 'se'], 'c7': ['s', 'se'], 'b6': ['s', 'se']};





function drawStone(nr, pos, color) {
        var stone= r.circle(coords[pos][0], coords[pos][1], STONE_RADIUS);
        stone.nr = nr;
        stone.attr({"stroke": color, "fill":color, "fill-opacity":0.9, "stroke-width": 2, cursor: "move"});
        stone.drag(move, dragger, up);
        return stone;
    }



function dragger(x, y) {
        this.ox = this.attr('cx');
        this.oy = this.attr('cy');
        this.animate({"fill-opacity": 0.5}, 200);
    }

function move(dx, dy) {
        var att = {cx: this.ox + dx, cy: this.oy + dy};
        this.field = null;
        for (field in border_points) {
             if (Math.sqrt(Math.pow(att.cx - coords[field][0], 2) + Math.pow(att.cy - coords[field][1], 2)) < STONE_RADIUS ){
                var dir_new = getDirection(field, this.ox + dx, this.oy + dy);
                if (this.dir != dir_new){
                    if (this.line != null)
                        this.line.remove();
                    if (dir_new != null) {
                        var dir_degree = {'ne': 330, 'se': 30, 's': 90, 'sw': 150, 'nw': 210, 'n': 270};
                        this.line = r.path("M 0 0 L 40 0");
                        this.line.transform("T" + coords[field][0] + " " + coords[field][1] + "t -20 0" + "r" + dir_degree[dir_new] + "t -45 0");
                        this.line.attr({"stroke-width": 5, "arrow-end": "classic-wide-long"});
                    }

                    this.dir = dir_new;
                }
                att = {cx: coords[field][0], cy: coords[field][1]};

                this.field = field;
            }
        }
        if (this.field == null)  {
            if (this.line != null) {
                this.line.remove();
                this.dir = null;
            }
        }
        this.attr(att);
    }


function getDirection(field, x, y) {
    var angle = Raphael.angle(x, y, coords[field][0], coords[field][1]);
    if ((angle >= 0) && (angle < 60)){
        dir = 'se';
    }
    else if (angle >= 60 && angle < 120){
        dir = 's';
    }
    else if (angle >= 120 && angle < 180){
        dir = 'sw';
    }
    else if (angle >= 180 && angle < 240){
        dir = 'nw';
    }
    else if (angle >= 240 && angle < 300){
        dir = 'n';
    }
    else if (angle >= 300 && angle < 360){
        dir = 'ne';
    }
    else return null;

    if (border_points[field].indexOf(dir) != -1)
        return dir;
    else
        return null;
}


function drawLines() {
        r.setStart();
        for(var ii = 0; ii <lines.length ; ii++){
            var posA = coords[lines[ii][0]];
            var posB = coords[lines[ii][1]];
            r.path("M"+posA[0]+" "+posA[1]+"L"+posB[0]+" "+posB[1]);
        }
        var lines_raphael = r.setFinish();
        lines_raphael.attr({"stroke-width": 2});
    }

function drawBorderFieldCircles() {
    r.setStart();
    for(var key in border_points)
        r.circle(coords[key][0], coords[key][1], RADIUS);
    var border_points_raphael = r.setFinish();
    border_points_raphael.attr({"title": pos, "fill":'#000', "fill-opacity":1, "stroke-width": 2});
}


function moveStone(stone_id, target_field) {
        stones[stone_id].animate({cx: coords[target_field][0], cy: coords[target_field][1] }, 300, 'linear', null);
    }


r = Raphael("holder", MAX_X, MAX_Y);
r.rect(0, 0, MAX_X-1, MAX_Y-1, 20).attr({stroke: "#666"});


drawLines();
drawBorderFieldCircles();
