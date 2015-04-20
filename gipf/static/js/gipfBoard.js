var SCALE = 50;
var WIDTH_RESERVE = 100;
var STONE_RADIUS = 20;
var MAX_X = 10 * SCALE + 2 * WIDTH_RESERVE + 4 * STONE_RADIUS;
var MAX_Y = 18 * SCALE * Math.sin(Raphael.rad(30)) + 4 * STONE_RADIUS;

var RADIUS = 7;

var ANIMATION_TIME = 100;

var r;
var r_stones = {};
var r_arrow = null;
var coords = {};


var dir_degree = {'ne': 330, 'se': 30, 's': 90, 'sw': 150, 'nw': 210, 'n': 270};

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
    'reserve_white': [1,1], 'reserve_black': [9,1],
    'out': [5,25]
};


for (var key in pos) {
    var x = pos[key][0]*SCALE + WIDTH_RESERVE + 2 * STONE_RADIUS;
    var y = MAX_Y - pos[key][1]*SCALE*Math.sin(Raphael.rad(30)) - 2 * STONE_RADIUS;
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



var reserve_stones_white = 0;
var reserve_stones_black = 0;
var coords_reserve = {white: {}, black: {}}

for(var i = 0; i <= 30; i++){
    if (i < 15) {
        var j = i + 1;
        coords_reserve[i] = [(2*(j % 2) + 1.5) * STONE_RADIUS, MAX_Y - (MAX_Y) / 8 * (j / 2)];
    }
    else {
        j = i -15 + 1;
        coords_reserve[i] = [MAX_X - (2*(j % 2)+1.5) * STONE_RADIUS, MAX_Y - (MAX_Y) / 8 * (j / 2)];
    }
}

function drawStone(nr, pos, color) {
    var r_stone;
    if (pos=='reserve_black' || pos=='reserve_white')
        r_stone = r.circle(coords_reserve[nr][0], coords_reserve[nr][1], STONE_RADIUS);
    else
        r_stone = r.circle(coords[pos][0], coords[pos][1], STONE_RADIUS);
    r_stone.nr = nr;
    r_stone.original_color = color;
    r_stone.attr({"stroke": color, "fill": color});
    return r_stone;
}



function drag_start(x, y) {
    this.ox = x - $("#holder > svg").offset().left;
    this.oy = y - $("#holder > svg").offset().top;
    this.animate({cx: this.ox, cy: this.oy, "fill-opacity": 0.5}, ANIMATION_TIME);
    this.snapped_to_field = null;
}

function drag_move(dx, dy) {
    var att = {cx: this.ox + dx, cy: this.oy + dy};
    if (this.snapped_to_field == null) {
        for (var field in border_points) {
            if (distanceToField(att.cx, att.cy, field) < STONE_RADIUS) {
                att = {cx: coords[field][0], cy: coords[field][1]};
                this.snapped_to_field = field;
            }
        }
        this.attr(att);
    }
    else {
        if (distanceToField(att.cx, att.cy, this.snapped_to_field) > 0.9 * SCALE) {
            this.snapped_to_field = null;
            r_arrow.hide();
        }
        else {
            var dir_new = getDirection(this.snapped_to_field, this.ox + dx, this.oy + dy);
            if (this.dir != dir_new) {
                r_arrow.hide();
                if (dir_new != null) {
                    r_arrow.attr({"stroke-width": 5, "arrow-end": "classic-wide-long"});
                    r_arrow.transform("T" + coords[this.snapped_to_field][0] + " " + coords[this.snapped_to_field][1] + "T -20 0" + "R" + dir_degree[dir_new] + "t -45 0");
                    r_arrow.show();
                }
                this.dir = dir_new;
            }
        }
    }
}

function distanceToField(x, y, field) {
    return Math.sqrt(Math.pow(x - coords[field][0], 2) + Math.pow(y - coords[field][1], 2));
}

function drag_end() {
    this.animate({"fill-opacity": 0.9}, 200);
    if (this.snapped_to_field && this.dir){
        r_arrow.hide();
        sendMove(this.snapped_to_field, this.nr, this.dir);
        this.dir = null;
        this.snapped_to_field = null;
    }
    else {
         var att= {cx: coords_reserve[this.nr][0], cy: coords_reserve[this.nr][1]};
         this.animate(att, ANIMATION_TIME);
    }
}


function getDirection(field, x, y) {
    var angle = Raphael.angle(x, y, coords[field][0], coords[field][1]);
    var dir;
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
    else {
      return null;
    }

    if (border_points[field].indexOf(dir) != -1)
        return dir;
    else
        return null;
}

function drawBoard() {

    r.rect(0, 0, WIDTH_RESERVE, MAX_Y, 30).attr({stroke: "#666"});
    r.rect(WIDTH_RESERVE+20, 0, MAX_X - 2 * (WIDTH_RESERVE + 20) , MAX_Y, 30).attr({stroke: "#666"});
    r.rect(MAX_X-WIDTH_RESERVE, 0, WIDTH_RESERVE, MAX_Y, 30).attr({stroke: "#666"});

    r.setStart();
    for(var ii = 0; ii <lines.length ; ii++){
        var posA = coords[lines[ii][0]];
        var posB = coords[lines[ii][1]];
        r.path("M"+posA[0]+" "+posA[1]+"L"+posB[0]+" "+posB[1]);
    }
    var r_lines = r.setFinish();
    r_lines.attr({"stroke-width": 2});

    r.setStart();
    for(var key in border_points)
        r.circle(coords[key][0], coords[key][1], RADIUS);
    var r_border_points = r.setFinish();
    r_border_points.attr({"title": pos, "fill":'#000', "fill-opacity":1, "stroke-width": 2});

    r_arrow = r.path("M 0 0 L 40 0");
    r_arrow.attr({"stroke-width": 5, "arrow-end": "classic"});
    r_arrow.hide();

}

function initStones(game_id) {
    $.get('/api/game/'+game_id, function (game_json) {
        for (var key in game_json.stones) {
            var stone = game_json.stones[key];
            r.setStart();
            r_stones[key] = drawStone(key, stone.field, stone.color);
            var r_stone_set = r.setFinish();
            r_stone_set.attr({"fill-opacity":0.9, "stroke-width": 4});
            if (stone.field=="reserve_black" || stone.field=="reserve_white")
                makeStoneMoveable(key);
            else
                makeStoneUnmoveable(key);
        }

    });
}


function updateBoard(game) {
    var stones_json = game.stones;
    for (var stone_id in stones_json) {
        moveStone(stone_id, stones_json[stone_id].field);

        var belongs_to_row = null;
        for (var row_id in game.open_takings) {
            var row = game.open_takings[row_id];
            if (row.stones.indexOf(stone_id)!=-1) {
                belongs_to_row = row_id;
            }
        }
        if (belongs_to_row!=null)
            markAsRow(r_stones[stone_id], row_id, row);
    }

}

function markAsRow(r_stone, row_id, row) {
    r_stone.attr("fill", "red");
    r_stone.attr({'cursor': 'crosshair'});
    r_stone.click( function () {
        sendTakeRow(row_id, row);
    });
}

function makeStoneUnmoveable(stone_id) {
    var r_stone = r_stones[stone_id];
    r_stone.attr({'cursor': 'default'});
    r_stone.undrag();
}

function makeStoneMoveable(stone_id) {
    var r_stone = r_stones[stone_id];
    r_stone.attr({'cursor': 'move'});
    r_stone.drag(drag_move, drag_start, drag_end);
}



function releaseStones(row){
    for (var row_id in row.stones) {
        var stone_id = row.stones[row_id]
        unmarkAsRow(r_stones[stone_id]);
        makeStoneMoveable(stone_id);
    }
}

function unmarkAsRow(r_stone) {
    r_stone.attr("fill", r_stone.original_color);
    r_stone.unclick();
}

function moveStone(stone_id, target_field) {
    if (target_field=='reserve_black' || target_field=='reserve_white')
        att = {cx: coords_reserve[stone_id][0], cy: coords_reserve[stone_id][1]};
    else
        att = {cx: coords[target_field][0], cy: coords[target_field][1]};
    r_stones[stone_id].animate(att, 300, 'linear', null);
}


function initRaphael(){
    r = Raphael("holder", MAX_X, MAX_Y);
    drawBoard();
}
