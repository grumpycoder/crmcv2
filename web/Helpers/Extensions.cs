using System;
using System.Globalization;

namespace web.Helpers
{
    public static class StringExtensions
    {
        public static decimal ToDecimal(this string input)
        {
            return Decimal.Parse(input, CultureInfo.CurrentCulture);
        }
    }
}
