using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;

namespace hahaton
{
    internal class MyPlan
    {
        public int width, length, height; // ширина длинна и высота прямоуг
        public int thickness; //толщина потолка\пола
        public MyRectangle source;
        public List<MyRectangle> consumer = new List<MyRectangle>();
        public List<MyLine> myRooms = new List<MyLine>(); // комнаты (координаты + параметры)

        public MyPlan(int width, int length, int height, int thickness)
        {
            myRooms.Add(new MyLine(0, 0, length, 0, -1));
            myRooms.Add(new MyLine(0, 0, 0, width, -1));
            myRooms.Add(new MyLine(0, width, length, width, -1));
            myRooms.Add(new MyLine(length, 0, length, width, -1));
            SetDefaut(width, length, height, thickness); 
        }
        public void SetDefaut(int w, int l, int h, int th)
        {
            if ( w < 5) { width = 5; } 
            else if ( w > 100) { width = 100; }
            else width = w;

            if (l < 5) { length = 5; }
            else if (l > 100) { length = 100; }
            else length = l;

            if (h < 5) { height = 5; }
            else if (h > 100) { height = 100; }
            else height = h;

            if (th < 10 ) { thickness = 10; }
            else if (th > 1) { thickness = 1; }
            else thickness = th;
        }
        public void SetConsumer(int x, int y, int h, int w)
        {
            consumer.Add(new MyRectangle(x, y, w, h));
        }
        public void SetSource(int x, int y, int h, int w)
        {
            source = new MyRectangle(x, y, h, w);
        }
        public void SetLine(int x1, int y1, int x2, int y2, int status)
        {
            myRooms.Add(new MyLine(x1, y1, x2, y2, status));
        }
    }
}
