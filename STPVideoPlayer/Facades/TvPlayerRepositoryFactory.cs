using Microsoft.Practices.Unity;
using STPVideoPlayer.DataLayer;

namespace STPVideoPlayer.Facades
{
    public static class TvPlayerRepositoryFactory
    {
        private static ITvPlayerRepository repo;

        public static ITvPlayerRepository Instance
        {
            get
            {
                if (repo == null)
                {
                    repo = UnityHelper.Instance.Resolve<ITvPlayerRepository>();

                    repo.CreateIfOlder();
                }

                return repo;
            }
        }
    }
}
