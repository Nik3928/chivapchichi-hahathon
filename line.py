from point import Point

class Line:

    def __init__(self,p1,p2):
        self.p1 = p1
        self.p2 = p2
    
    def intersect(self,path):
        def area(a,b,c): # Points, oriented triangle area
            return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)

        def subinter(a,b,c,d):
            if a > b:
                a,b = b,a
            if c > d:
                c,d = d,c
            return max(a,c) <= min(b,d)
        
        res = subinter(self.p1.x, self.p2.x, path.p1.x, path.p2.x) and \
                subinter(self.p1.y, self.p2.y, path.p1.y, path.p2.y) and \
                ( area(self.p1, self.p2, path.p1) * area(self.p1, self.p2, path.p2) <= 0 ) and \
                ( area(path.p1, path.p2, self.p1) * area(path.p1, path.p2, self.p2) <= 0)
        return res
        
        # if (isinstance(self.p1.x,int)): # x is int, horizontal wall
        #     if (self.p1.x == path.p1.x) or (self.p1.x == path.p2.x) or (self.p2.x == path.p1.x) or (self.p2.x == path.p2.x): # at least one x the same
        #         if (self.p1.y - path.p1.y + self.p2.y - path.p2.y) == 0: #Intersect
        #             return True
        #     return False
        # else: # y is int, vertical wall
        #     if (self.p1.y == path.p1.y) or (self.p1.y == path.p2.y) or (self.p2.y == path.p1.y) or (self.p2.y == path.p2.y): # at least one y the same
        #         if (self.p1.x - path.p1.x + self.p2.x - path.p2.x) == 0: #Intersect
        #             return True
        #     return False 
