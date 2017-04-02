
import org.jnativehook.GlobalScreen;
import org.jnativehook.NativeHookException;
import org.jnativehook.mouse.NativeMouseEvent;
import org.jnativehook.mouse.NativeMouseInputListener;

import java.util.Date;
import java.lang.Thread;
import java.util.logging.*;
import java.awt.Robot;
import java.awt.event.KeyEvent;

// https://github.com/kwhat/jnativehook.git

public class ScreenSaver implements NativeMouseInputListener {
	private static int 		timeout 	= 5;
	private static long 	startTime 	= 0;
	private static boolean 	isActive 	= false;
	private static Robot 	robot;
	private static Boolean  mutex       = new Boolean(true);

	
	public static void resetTimer() {
		startTime = (new Date()).getTime();
	}
	
	public void nativeMouseClicked(NativeMouseEvent e) {
		synchronized(mutex) {
			if (isActive) {
				resetTimer();
				robot.keyPress(KeyEvent.VK_ALT);
				robot.keyPress(KeyEvent.VK_F4);
				robot.keyRelease(KeyEvent.VK_F4);
				robot.keyRelease(KeyEvent.VK_ALT);
				isActive = false;
			}
			System.out.println("X=" + e.getX() + ", Y=" + e.getY());
			if (e.getX() <= 10 && e.getY() <= 10) {
				startTime = 0;
				isActive = false;
			} else {
				resetTimer();
			}
		}
	}

	public void nativeMousePressed(NativeMouseEvent e) {
	}

	public void nativeMouseReleased(NativeMouseEvent e) {
	}

	public void nativeMouseMoved(NativeMouseEvent e) {
		resetTimer();
	}

	public void nativeMouseDragged(NativeMouseEvent e) {
	}

	public static void main(String[] args) {
		if (args.length != 0) {
			timeout = Integer.parseInt(args[0]);
		}
		
		try {
			robot = new Robot();
			
			GlobalScreen.registerNativeHook();
		}
		catch (Exception ex) {
			System.err.println("There was a problem registering the native hook.");
			System.err.println(ex.getMessage());

			System.exit(1);
		}

		Logger logger = Logger.getLogger(GlobalScreen.class.getPackage().getName());
		logger.setLevel(Level.OFF);
		
		// Construct the example object.
		ScreenSaver example = new ScreenSaver();

		// Add the appropriate listeners.
		GlobalScreen.addNativeMouseListener(example);
		
		GlobalScreen.addNativeMouseMotionListener(example);
		
		resetTimer();
		
		try {
			while (true) {
				Thread.currentThread().sleep(100);
				synchronized(mutex) {
					if (!isActive) {
						long now = (new Date()).getTime();
						
						if ((now - startTime) > timeout * 1000) {
							isActive = true;
							System.out.println("TimeOut Expired");
							ProcessBuilder processBuilder = new ProcessBuilder("LaunchBrowser.bat");
	
							Process runningProcess = processBuilder.start();
	
							Thread.currentThread().sleep(1000);
	
							robot.keyPress(KeyEvent.VK_F11);
							
							robot.keyRelease(KeyEvent.VK_F11);
						}
					}
				}
			}
		} catch (Exception e) {};
	}
}