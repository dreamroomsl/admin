import java.net.URI;

import javax.websocket.ClientEndpoint;
import javax.websocket.CloseReason;
import javax.websocket.ContainerProvider;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.WebSocketContainer;


@ClientEndpoint
public class TimerWebSocket {

    Session   userSession 	= null;
    String    branchId;
    String    timerId;

    public static TimerWebSocket start(String url, String branchId, String timerId) {
    	try {
	        return new TimerWebSocket(new URI(url), branchId, timerId);
    	} catch( Exception e) {
    		e.printStackTrace();
    	}
    	return null;
    }
    
    public TimerWebSocket(URI endpointURI, String branchId, String timerId) {
        try {
        	this.branchId = branchId;
        	this.timerId  = timerId;
        	
            WebSocketContainer container = ContainerProvider.getWebSocketContainer();
            container.connectToServer(this, endpointURI);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    
    @OnOpen
    public void onOpen(Session userSession) {
        System.out.println("opening websocket");
        this.userSession = userSession;
              
        sendMessage("initialize " + branchId + " " + timerId);
    }

    
    @OnClose
    public void onClose(Session userSession, CloseReason reason) {
        System.out.println("closing websocket");
        this.userSession = null;
    }

    
    @OnMessage
    public void onMessage(String message) {
    	if (message.startsWith("start")) {
    		TimeController.start(Integer.parseInt(message.substring(5).trim()));
    	} else if (message.startsWith("stop")) {
    		TimeController.stop();
    	} else if (message.startsWith("pause")) {
    		TimeController.pause();    		
    	} else if (message.startsWith("resume")) {
    		TimeController.resume();   		
    	} else if (message.startsWith("timeout")) {
    		TimeController.timeout(message.substring(7).trim());
    	} else if (message.startsWith("query")) {
    		TimeController.query();
    	}
    }
   
    public void sendMessage(String message) {
    	this.userSession.getAsyncRemote().sendText(message);
    }
}
