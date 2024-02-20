namespace Weatherly.Logic
{
    public class EncryptUrl
    {
        private string Encrypt(string input)
        {
            string EncryptionKey = "MAKV2SPBNI99212";
            byte[] data = System.Text.Encoding.ASCII.GetBytes(input);
            data = new System.Security.Cryptography.SHA256Managed().ComputeHash(data);
            return System.Text.Encoding.ASCII.GetString(data);
        }
    }
}
