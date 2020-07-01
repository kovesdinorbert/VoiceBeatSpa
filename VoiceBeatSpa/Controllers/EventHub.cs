using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace VoiceBeatSpa.Web.Controllers
{
    [Authorize]
    public class EventHub : Hub
    {
        public async override Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public void SendToAll(string newEvent)
        {
            Clients.All.SendAsync("sendToAll","event change");
        }
    }
}
