class Point:
    def __init__(self,x,y):
        self.x = x
        self.y = y
    
    def __add__(self,second):
        pt = Point(self.x + second.x, self.y + second.y)
        return pt
    
    def __sub__(self,second):
        pt = Point(self.x - second.x, self.y - second.y)
        return pt

    