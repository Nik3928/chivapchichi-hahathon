using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace hahaton
{
    class MyRectangle
    {
        protected int x, y, h, w;

        public int X { get { return x; } set { x = value; } }
        public int Y { get { return y; } set { y = value; } }
        public int H { get { return h; } set { h = value; } }
        public int W { get { return w; } set { w = value; } }

        public MyRectangle(int x, int y, int h, int w) //Конструктор класса для прямоугольника
        {
            Set(x, y, h, w);
        }

        public void Set(int x, int y, int h, int w)
        {
            this.x = x;
            this.y = y;
            this.h = h;
            this.w = w;
        }
    }
}
