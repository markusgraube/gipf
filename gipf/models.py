"""
Created on 06.04.2015

@author: Markus Graube
"""
from datetime import datetime

from singleton import Singleton

import logging

log = logging.getLogger(__name__)



@Singleton
class Configuration():
    def __init__(self):
        self.counter = 0

        m = Human("Markus")
        s = Human("Stephan")
        self.players = (m, s)

        self.game_list = {'firstGame': Game(m, s), 'secondGame': Game(s, m), 'testGame': Game(s, None)}


class Player():
    def __init__(self, name):
        self.name = name

    def __str__(self):
        return self.name


class Human(Player):
    pass


class Computer(Player):
    pass


class Game():
    def __init__(self, player1, player2):
        self.board = Board()
        self.player_white = player1
        self.player_black = player2
        self.board = Board()
        self.turn = 0
        self.winner = None
        self.datetime_start = datetime.now()
        self.datetime_end = None

    def winner(self):
        if self.board.numberOfFreeStones('black')==0:
            return self.player_white
        if self.board.numberOfFreeStones('white')==0:
            return self.player_black


class Board():
    """ representing a board with fields and stones """

    def __init__(self):
        """
        Constructor
        """
        self.fields = {}
        self.border_fields = []
        self.stones = {}
        self.reserve_white = Field("reserve_white")
        self.reserve_black = Field("reserve_black")

        self._create_fields()
        self._create_stones()


    def _create_fields(self):
        row_a = []
        for i in range(5):
            row_a.append(Field('a' + str(i + 1)))
        row_b = []
        for i in range(6):
            row_b.append(Field('b' + str(i + 1)))
        row_c = []
        for i in range(7):
            row_c.append(Field('c' + str(i + 1)))
        row_d = []
        for i in range(8):
            row_d.append(Field('d' + str(i + 1)))
        row_e = []
        for i in range(9):
            row_e.append(Field('e' + str(i + 1)))
        row_f = []
        for i in range(8):
            row_f.append(Field('f' + str(i + 1)))
        row_g = []
        for i in range(7):
            row_g.append(Field('g' + str(i + 1)))
        row_h = []
        for i in range(6):
            row_h.append(Field('h' + str(i + 1)))
        row_i = []
        for i in range(5):
            row_i.append(Field('i' + str(i + 1)))

        temp = []
        temp.extend(row_a)
        temp.extend(row_b)
        temp.extend(row_c)
        temp.extend(row_d)
        temp.extend(row_e)
        temp.extend(row_f)
        temp.extend(row_g)
        temp.extend(row_h)
        temp.extend(row_i)

        for f in temp:
            self.fields[f.nr] = f

        # set border fields
        self.border_fields.extend(row_a)
        self.border_fields.extend(row_i)
        for row in (row_b, row_c, row_d, row_e, row_f, row_g, row_h):
            self.border_fields.append(row[0])
            self.border_fields.append(row[len(row) - 1])
        for f in self.border_fields:
            f.border = True


        # nw -> se
        for i in range(1, 5):
            self._connect_nw_se(row_a[i], row_b[i])
            self._connect_nw_se(row_h[i], row_i[i - 1])
        for i in range(1, 6):
            self._connect_nw_se(row_b[i], row_c[i])
            self._connect_nw_se(row_g[i], row_h[i - 1])
        for i in range(1, 7):
            self._connect_nw_se(row_c[i], row_d[i])
            self._connect_nw_se(row_f[i], row_g[i - 1])
        for i in range(1, 8):
            self._connect_nw_se(row_d[i], row_e[i])
            self._connect_nw_se(row_e[i], row_f[i - 1])

        # w -> e
        for row in (row_a, row_b, row_c, row_d, row_e, row_f, row_g, row_h, row_i):
            for i in range(1, len(row)):
                self._connect_north_south(row[i], row[i - 1])

        # sw -> ne
        for i in range(1, 5):
            self._connect_sw_ne(row_a[i - 1], row_b[i])
            self._connect_sw_ne(row_h[i], row_i[i])
        for i in range(1, 6):
            self._connect_sw_ne(row_b[i - 1], row_c[i])
            self._connect_sw_ne(row_g[i], row_h[i])
        for i in range(1, 7):
            self._connect_sw_ne(row_c[i - 1], row_d[i])
            self._connect_sw_ne(row_f[i], row_g[i])
        for i in range(1, 8):
            self._connect_sw_ne(row_d[i - 1], row_e[i])
            self._connect_sw_ne(row_e[i], row_f[i])


    def _create_stones(self):
        for i in range(12):
            w = Stone(i, 'white', self.reserve_white)
            b = Stone(15 + i, 'black', self.reserve_black)
            self.stones[i]=w
            self.stones[i+15]=b
        for i in range(3):
            w = Stone(12 + i, 'white', self.reserve_white, True)
            b = Stone(27 + i, 'black', self.reserve_black, True)
            self.stones[i+12]=w
            self.stones[i+27]=b


    def _connect_sw_ne(self, sw, ne):
        ne.neighbor['sw'] = sw
        sw.neighbor['ne'] = ne

    def _connect_nw_se(self, nw, se):
        nw.neighbor['se'] = se
        se.neighbor['nw'] = nw

    def _connect_north_south(self, north, south):
        north.neighbor['s'] = south
        south.neighbor['n'] = north


    def toJSON(self):
        json = {}
        for key in self.stones:
            stone = self.stones[key]
            json[key] = {'field': stone.field.nr, 'color': stone.color, 'gipf': stone.gipf}
        return json


    def move(self, stone, field, direction):
        # check parameters
        if stone.field not in (self.reserve_black, self.reserve_white):
            raise Exception("Not one from reserve")
        if not field.is_free_or_field_behind(direction):
            raise Exception("Not one field free in line")
        # set stone
        field.stone = stone
        # move stones
        field.move_neighbor(direction)

    def check4StonesinRow(self):
        rows = []
        for key in self.fields:
            field = self.fields[key]
            for direction in ('n', 'ne', 'nw'):
                for color in ('white', 'black'):
                    number = field.stonesInRow(color, direction)
                    if number >= 4:
                        rows.append({'field': field, 'dir': direction, 'color': color})
                        log.info("4 in a row @" + field.nr + "-" + direction + ": " + str(number))
        return rows

    def numberOfFreeStones(self, color):
        ii = 0
        for key in self.stones:
            stone = self.stones[key]
            if stone.color == color and stone.field in ('reserve_white', 'reserve_black'):
                ii += 1
        return ii


class Field():
    """
    Field in gipf game
    """

    def __init__(self, nr):
        """
        Constructor
        """
        self.nr = nr
        self.stone = None
        self.neighbor = {'nw': None, 'n': None, 'ne': None, 'se': None, 's': None, 'sw': None}
        self.border = False

    def __str__(self):
        return str(self.nr)

    def is_free(self):
        return self.stone is None and not self.border

    def is_free_or_field_behind(self, direction):
        if self.is_free():
            return True
        if self.neighbor[direction] and self.neighbor[direction].is_free_or_field_behind(direction):
            return True
        return False

    def move_neighbor(self, direction):
        if not self.neighbor[direction].is_free():
            self.neighbor[direction].move_neighbor(direction)
        self.stone.field = self.neighbor[direction]
        self.neighbor[direction].stone = self.stone
        self.stone = None

    def stonesInRow(self, color, direction):
        if self.stone and self.stone.color == color:
            return 1 + self.neighbor[direction].stonesInRow(color, direction)
        else:
            return 0


class Stone():
    """
    representing a stone or piece in gipf game
    """

    def __init__(self, stone_id, color, field, gipf=False):
        self.id = stone_id
        self.color = color
        self.field = field
        self.gipf = gipf

