using InternetNow_API.DTOs;
using InternetNowV2_API.Services.Interfaces;

namespace InternetNowV2_API.Services.Repositories
{
    public class PrintObjectRepo : IPrintObjectRepo
    {
        public async Task<string> GenerateObjectString(PrintObject printObject)
        {
            string result = "";
            if (printObject.IsNeumericCount == true && printObject.IsAlphaneumericCount == true && printObject.IsFloatCount == false)
            {
                var intObj = GenerateRandomNumeric(printObject.NumericPercentage);
                var alphaNumericObject = GenerateAlphaNeumeric(printObject.AlphanumericPercentage);
                result = $"{intObj},{alphaNumericObject},";
            }
            else if (printObject.IsNeumericCount == true && printObject.IsAlphaneumericCount == false && printObject.IsFloatCount == false)
            {
                var intObj = GenerateRandomNumeric(printObject.NumericPercentage);
                result = $"{intObj},";
            }
            else if (printObject.IsNeumericCount == false && printObject.IsAlphaneumericCount == true && printObject.IsFloatCount == true)
            {
                var alphaNumericObject = GenerateAlphaNeumeric(printObject.AlphanumericPercentage);
                var floatObj = GenerateRandomFloat(printObject.FloatPercentage);
                result = $"{alphaNumericObject},{floatObj},";
            }
            else if (printObject.IsNeumericCount == true && printObject.IsAlphaneumericCount == false && printObject.IsFloatCount == true)
            {
                var intObj = GenerateRandomNumeric(printObject.NumericPercentage);
                var floatObj = GenerateRandomFloat(printObject.FloatPercentage);
                result = $"{intObj},{floatObj},";
            }
            else if (printObject.IsNeumericCount == false && printObject.IsAlphaneumericCount == false && printObject.IsFloatCount == true)
            {
                var floatObj = GenerateRandomFloat(printObject.FloatPercentage);
                result = $"{floatObj},";
            }
            else if (printObject.IsNeumericCount == false && printObject.IsAlphaneumericCount == true && printObject.IsFloatCount == false)
            {
                var alphaNumericObject = GenerateAlphaNeumeric(printObject.AlphanumericPercentage);
                result = $"{alphaNumericObject},";
            }
            else
            {
                var intObj = GenerateRandomNumeric(printObject.NumericPercentage);
                var alphaNumericObject = GenerateAlphaNeumeric(printObject.AlphanumericPercentage);
                var floatObj = GenerateRandomFloat(printObject.FloatPercentage);
                result = $"{intObj},{alphaNumericObject},{floatObj},";
            }

            return result;
        }

        private string GenerateRandomFloat(int length)
        {
            var strObj = "";
            while (length > 0)
            {
                Random random = new Random();
                double fVal = (random.NextDouble() * (1000 - 1) + 1);
                strObj += fVal.ToString() + ",";
                length--;
            }
            return strObj.TrimEnd(',');
        }

        private string GenerateRandomNumeric(int length)
        {
            var strObj = "";
            while(length > 0)
            {
                Random random = new Random();
                int number = random.Next(1, int.MaxValue);
                strObj += number + ",";
                length--;
            }
            return strObj.TrimEnd(',');
        }

        private string GenerateAlphaNeumeric(int length)
        {
            var strObj = "";
            while (length > 0)
            {
                const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                Random random = new Random();
                var str = new string(Enumerable.Repeat(chars, 10)
                    .Select(s => s[random.Next(s.Length)]).ToArray());
                strObj += str + ",";
                length--;
            }
            return strObj.TrimEnd(',');
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
