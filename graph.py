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

    def cost(self,pos1,pos2):
        x1,y1,z1 = pos1.split('-')
        x1 = int(x1)
        y1 = int(y1)
        z1 = int(z1)
        x2,y2,z2 = pos2.split('-')
        x2 = int(x2)
        y2 = int(y2)
        z2 = int(z2)
        val = abs(x1-x2) + abs(y1-y2) + 27*abs(z1-z2)
        return val

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
        