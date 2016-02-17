using Microsoft.VisualStudio.TestTools.UnitTesting;
using STPVideoPlayer.Facades;

namespace STPVideoPlayer.Tests
{
    [TestClass]
    public class TestTvPlayerRepositoryFactory
    {
        [TestMethod]
        public void TestResolveInstanceTvPlayerRepositoryFactory()
        {
            var repo = TvPlayerRepositoryFactory.Instance;
            Assert.IsNotNull(repo);
        }
    }
}
