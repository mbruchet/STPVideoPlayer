using System.Collections.Generic;
using System.Data.Entity.Design.PluralizationServices;
using System.Dynamic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Xml.Linq;

namespace STPVideoPlayer.DataLayer
{
    public static class ExpandoHelper
    {
        public static dynamic ReadDocument(string path)
        {
            XDocument xDoc = null;

            if (Path.IsPathRooted(path) == false)
            {
                path = System.Web.HttpContext.Current.Server.MapPath(path);
            }

            xDoc = XDocument.Load(path);
            dynamic root = new ExpandoObject();

            Parse(root, xDoc.Elements().First());

            return root;
        }

        public static void Parse(dynamic parent, XElement node)
        {
            var pluralizationService = PluralizationService.CreateService(new CultureInfo("en-US"));
            var item = new ExpandoObject();

            string name = pluralizationService.Singularize(node.Name.LocalName);

            name = name.EndsWith("s") ? name.TrimEnd('s') : name;

            if (node.Elements(XName.Get(name)).Count() > 0)
            {
                var list = new List<dynamic>();

                foreach (XElement child in node.Elements(XName.Get(name)))
                {
                    Parse(list, child);
                }

                AddProperty(parent, node.Name.ToString(), list);
            }
            else
            {
                foreach (var attribute in node.Attributes())
                {
                    AddProperty(item, attribute.Name.ToString(), attribute.Value);
                }

                if (node.HasElements)
                {
                    foreach (var element in node.Elements())
                    {
                        var list = new List<dynamic>();

                        string nameItem = pluralizationService.Singularize(element.Name.ToString());

                        if (element.Elements(nameItem).Count() > 0)
                        {
                            foreach (var ch in element.Elements(nameItem))
                            {
                                Parse(list, ch);
                            }
                        }
                        else
                        {
                            Parse(list, element);
                        }

                        AddProperty(item, element.Name.ToString(), list);
                    }

                }

                AddProperty(parent, name, item);
            }
        }

        private static void AddProperty(dynamic parent, string name, object value)
        {
            if (parent is List<dynamic>)
            {
                (parent as List<dynamic>).Add(value);
            }
            else
            {
                (parent as IDictionary<string, object>)[name] = value;
            }
        }
    }
}
