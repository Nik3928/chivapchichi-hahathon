using System;
using System.Drawing;
using System.Windows.Forms;

namespace hahaton
{
    public class InputBox : Form
    {
        private readonly TextBox _textBox;

        public InputBox(string title = "", string labeltext = "", bool isDigits = false)
        {
            StartPosition = FormStartPosition.CenterScreen;
            MaximizeBox = false;
            MinimizeBox = false;
            FormBorderStyle = FormBorderStyle.Fixed3D;
            Size = new Size(300, 150);
            Text = title;
            
            _textBox = new TextBox
            {
                Size = new Size(250, 25),
                Font = new Font(DefaultFont, FontStyle.Regular),
                Location = new Point(20, 50),
                Text = ""
            };

            if (isDigits)
            {
                _textBox.KeyPress += SetOnlyDigits;
            }

            Controls.Add(_textBox);

            _textBox.Show();

            _textBox.KeyPress += textBox_KeyPress;

            var label = new Label
            {
                AutoSize = false,
                Size = new Size(250, 25)
            };
            label.Font = new Font(label.Font, FontStyle.Regular);
            label.Location = new Point(20, 25);
            label.Text = labeltext;

            Controls.Add(label);

            label.Show();

            var buttonOk = new Button
            {
                Size = new Size(80, 25),
                Location = new Point(105, 75),
                DialogResult = DialogResult.OK,
                Text = "OK"
            };

            Controls.Add(buttonOk);

            buttonOk.Show();

            var buttonCancel = new Button
            {
                Size = new Size(80, 25),
                Location = new Point(190, 75),
                Text = "Cancel"
            };

            Controls.Add(buttonCancel);

            buttonCancel.Show();

            buttonCancel.Click += buttonCancel_Click;
        }

        public void textBox_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (e.KeyChar != (char) Keys.Enter)
            {
                return;
            }
            DialogResult = DialogResult.OK;

            Close();
        }

        public void buttonCancel_Click(object sender, EventArgs e)
        {
            Close();
        }

        public string GetString()
        {
            return ShowDialog() != DialogResult.OK ? null : _textBox.Text;
        }

        public void SetOnlyDigits(object sender, KeyPressEventArgs e)
        {
            if ((e.KeyChar <= 47 || e.KeyChar >= 58) && e.KeyChar != 8)
                e.Handled = true;
        }
    }
}
