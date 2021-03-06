﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System.Threading.Tasks;
using System.Web.Http.Cors;
using CRMC.Domain;

namespace web.Hubs
{
    public class NameNotificationHub : Hub
    {
        public Task AddName(string kiosk, Person person)
        {
            return Clients.All.addName(kiosk, person);
        }

        public Task ConfigurationChange(Configuration config)
        {
            return Clients.All.configurationChange(config);
        }
    }
}
