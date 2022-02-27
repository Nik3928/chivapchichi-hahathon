using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;


namespace hahaton
{
    internal class MyLine
    {
        public int x1, y1, x2, y2; // Координаты точек
        public int status;   // красная или чёрная

        public MyLine() { }

        public MyLine(int x1, int y1, int x2, int y2, int status)
        {
            Set(x1, y1, x2, y2, status);
        }

        public void Set(int x1, int y1, int x2, int y2, int status) 
        {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
            this.status = status;
        }
    }
}
