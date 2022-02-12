using InternetNow_API.DTOs;
using InternetNowV2_API.Services.Interfaces;

namespace InternetNowV2_API.Services.Repositories
{
    public class PrintObjectRepo : IPrintObjectRepo
    {
        private string GenerateAlphaNeumeric()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            Random random = new Random();
            return new string(Enumerable.Repeat(chars, 10)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public async Task<string> GenerateObjectString(PrintObject printObject)
        {
            string result = "";
            if (printObject.IsNeumericCount == true && printObject.IsAlphaneumericCount == true && printObject.IsFloatCount == false)
            {
                var intObj = GenerateRandomNumeric();
                var alphaNumericObject = GenerateAlphaNeumeric();
                result = $"{intObj},{alphaNumericObject},";
            }
            else if (printObject.IsNeumericCount == true && printObject.IsAlphaneumericCount == false && printObject.IsFloatCount == false)
            {
                var intObj = GenerateRandomNumeric();
                result = $"{intObj},";
            }
            else if (printObject.IsNeumericCount == false && printObject.IsAlphaneumericCount == true && printObject.IsFloatCount == true)
            {
                var alphaNumericObject = GenerateAlphaNeumeric();
                var floatObj = GenerateRandomFloat();
                result = $"{alphaNumericObject},{floatObj},";
            }
            else if (printObject.IsNeumericCount == true && printObject.IsAlphaneumericCount == false && printObject.IsFloatCount == true)
            {
                var intObj = GenerateRandomNumeric();
                var floatObj = GenerateRandomFloat();
                result = $"{intObj},{floatObj},";
            }
            else if (printObject.IsNeumericCount == false && printObject.IsAlphaneumericCount == false && printObject.IsFloatCount == true)
            {
                var floatObj = GenerateRandomFloat();
                result = $"{floatObj},";
            }
            else if (printObject.IsNeumericCount == false && printObject.IsAlphaneumericCount == true && printObject.IsFloatCount == false)
            {
                var alphaNumericObject = GenerateAlphaNeumeric();
                result = $"{alphaNumericObject},";
            }
            else
            {
                var intObj = GenerateRandomNumeric();
                var alphaNumericObject = GenerateAlphaNeumeric();
                var floatObj = GenerateRandomFloat();
                result = $"{intObj},{alphaNumericObject},{floatObj},";
            }

            return result;
        }

        private float GenerateRandomFloat()
        {
            Random random = new Random();
            double val = (random.NextDouble() * (1000 - 1) + 1);
            return (float)val;
        }

        private int GenerateRandomNumeric()
        {
            Random random = new Random();
            int number = random.Next(1, int.MaxValue);
            return number;
        }

        public async Task<FileContent> GetReportInfo()
        {
            FileContent fileContent = new FileContent();
            string pathToSave = Path.Combine(Environment.CurrentDirectory, @"UploadFiles\", "myFile.txt");
            FileInfo logFileInfo = new FileInfo(pathToSave);
            if (logFileInfo.Exists)
            {
                using (StreamReader file = new StreamReader(pathToSave))
                {
                    int counter = 0;
                    string ln;

                    while ((ln = file.ReadLine()) != null)
                    {
                        ln = ln.TrimEnd(',');
                        string[] arr = ln.Split(',');
                        foreach (var a in arr)
                        {
                            if (int.TryParse(a, out int value))
                            {
                                fileContent.NeumericCount++;
                                if (counter <= 20) fileContent.contentItems.Add($"{a} - numeric");

                            }
                            else if (float.TryParse(a, out float stringVal))
                            {
                                fileContent.FloatCount++;
                                if (counter <= 20) fileContent.contentItems.Add($"{a} - float");

                            }
                            else
                            {
                                fileContent.AlphaneumericCount++;
                                if (counter <= 20) fileContent.contentItems.Add($"{a} - alphanumeric");
                            }
                            counter++;
                        }
                    }
                    file.Close();
                }
            }
            return fileContent;
        }

        public async Task<bool> WriteLog(string strLog)
        {
            StreamWriter log;
            FileStream fileStream = null;
            DirectoryInfo logDirInfo = null;
            FileInfo logFileInfo;
            string fileName = "myFile.txt";
            string pathToSave = Path.Combine(Environment.CurrentDirectory, @"UploadFiles\", fileName);
            logFileInfo = new FileInfo(pathToSave);
            logDirInfo = new DirectoryInfo(logFileInfo.DirectoryName);

            if (!logDirInfo.Exists) logDirInfo.Create();
            if (!logFileInfo.Exists)
            {
                fileStream = logFileInfo.Create();
            }
            else
            {
                fileStream = new FileStream(pathToSave, FileMode.Append);
            }
            log = new StreamWriter(fileStream);
            if (!string.IsNullOrEmpty(strLog))
                log.Write(strLog);
            log.Close();
            return true;
        }
    }
}
