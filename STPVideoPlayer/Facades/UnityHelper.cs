using Microsoft.Practices.Unity;
using Microsoft.Practices.Unity.Configuration;
using System;
using System.Configuration;

namespace STPVideoPlayer.Facades
{
    public class UnityHelper
    {
        private UnityHelper()
        {

        }

        static IUnityContainer unity = null;

        public static IUnityContainer Instance
        {
            get
            {
                if (unity == null)
                {
                    var fileMap = new ExeConfigurationFileMap { ExeConfigFilename = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "unity.config") };
                    Configuration configuration = ConfigurationManager.OpenMappedExeConfiguration(fileMap, ConfigurationUserLevel.None);
                    var unitySection = (UnityConfigurationSection)configuration.GetSection("unity");
                    unity = new UnityContainer().LoadConfiguration(unitySection);
                }

                return unity;
            }
        }
    }
}
