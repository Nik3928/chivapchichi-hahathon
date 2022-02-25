from line import Line
from point import Point

class Graph:
    def __init__(self,size):
        self.x = size[0]
        self.y = size[1]
        self.z = size[2]

        self.walls = {}
        for i in range(self.z):
            self.walls[i] = []


    def add_wall(self,wall,lev):
        self.walls[lev].append(wall)

    def neighbors(self,pos):
        x,y,z = pos.split('-')
        x = int(x)
        y = int(y)
        z = int(z)
        neighs = []
        if (x > 0):
            intersect = False
            for wall in self.walls[z]:
                if wall.intersect(Line(Point(x,y),Point(x-1,y))):
                    intersect = True
            if not intersect:
                neighs.append(f"{x-1}-{y}-{z}")
        if (y > 0):
            intersect = False
            for wall in self.walls[z]:
                if wall.intersect(Line(Point(x,y),Point(x,y-1))):
                    intersect = True
            if not intersect:
                neighs.append(f"{x}-{y-1}-{z}")
        if (x < self.x - 1):
            intersect = False
            for wall in self.walls[z]:
                if wall.intersect(Line(Point(x,y),Point(x+1,y))):
                    intersect = True
            if not intersect:
                neighs.append(f"{x+1}-{y}-{z}")
        if (y < self.y - 1):
            intersect = False
            for wall in self.walls[z]:
                if wall.intersect(Line(Point(x,y),Point(x,y+1))):
                    intersect = True
            if not intersect:
                neighs.append(f"{x}-{y+1}-{z}")
        if (z > 0):
            neighs.append(f"{x}-{y}-{z-1}")
        if (z < self.z - 1):
            neighs.append(f"{x}-{y}-{z+1}")
        return neighs
        