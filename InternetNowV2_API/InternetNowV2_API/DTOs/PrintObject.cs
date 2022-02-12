using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InternetNow_API.DTOs
{
    public class PrintObject
    {
        public int FileSize { get; set; }
        public bool IsNeumericCount { get; set; }
        public bool IsAlphaneumericCount { get; set; }
        public bool IsFloatCount { get; set; }
        public bool ApplyConfiguration { get; set; }
        public int NumericPercentage { get; set; }
        public int AlphanumericPercentage { get; set; }
        public int FloatPercentage { get; set; }
    }

    public class FileContent
    {
        public int NeumericCount { get; set; } = 0;
        public int AlphaneumericCount { get; set; } = 0;
        public int FloatCount { get; set; } = 0;
        public List<string> contentItems { get; set; } = new List<string>();
    }

    public class ObjectCounter
    {
        public int NumberCount { get; set; }
        public int FloatCount { get; set; }
        public int CharacterCount { get; set; }
    }
}
