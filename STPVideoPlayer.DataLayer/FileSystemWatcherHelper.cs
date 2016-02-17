using System;
using System.IO;

namespace STPVideoPlayer.DataLayer
{
    public delegate void FileDataChangedHandler(object sender, EventArgs e);

    public class FileSystemWatcherHelper
    {
        public event FileDataChangedHandler FileDataChanged;

        public void WatchFile(string path, string FileName)
        {
            FileSystemWatcher watcher = new FileSystemWatcher();
            watcher.Path = path;
            watcher.Filter = FileName;
            watcher.NotifyFilter = NotifyFilters.LastWrite;
            watcher.Changed += Watcher_Changed;
            watcher.EnableRaisingEvents = true;
        }

        private void Watcher_Changed(object sender, FileSystemEventArgs e)
        {
            if (this.FileDataChanged != null)
                this.FileDataChanged(sender, e);
        }
    }
}
