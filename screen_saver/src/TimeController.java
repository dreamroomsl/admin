
import java.awt.FlowLayout;

import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.Clip;
import javax.swing.*;
import javax.swing.plaf.metal.MetalLookAndFeel;

import java.awt.*;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;

public class TimeController {

	final static int 		ACTION_NONE  		= 0;
	final static int 		ACTION_START 		= 1;
	final static int 		ACTION_PAUSE 		= 2;
	final static int 		ACTION_END   		= 3;
	
	static int 				action = ACTION_NONE;
	static String 			actionKey = "";
	static boolean  		isRunning = false;
	
	static JFrame   		timerWindow    = null;
	static JButton  		timerButton    = null;
	static int      		timerInSeconds = 600;
	static Clip     		soundClip	   = null;
	static TimerWebSocket 	webSocket	   = null;
	
	public static void playSound(boolean repeat) {
	    try {
    		AudioInputStream audioInputStream = AudioSystem.getAudioInputStream(new File("Timer.wav").getAbsoluteFile());
    		soundClip = AudioSystem.getClip();
    		soundClip.open(audioInputStream);

    		if (repeat) {
	        	soundClip.loop(Clip.LOOP_CONTINUOUSLY);
	        }
    		soundClip.start();
	    } catch(Exception ex) {
	        System.out.println("Error with playing sound.");
	        ex.printStackTrace();
	    }
	}
	
	public static void stopSound() {
	    try {
	    	if (soundClip != null) {
	    		soundClip.stop();
	    	}
	    	soundClip = null;
	    } catch(Exception ex) {
	        System.out.println("Error stoping sound.");
	        ex.printStackTrace();
	    }
	}

	public static void stop() {
		isRunning = false;
		if (timerWindow != null) {
			timerWindow.dispose();
		}
		timerWindow = null;
		stopSound();
	}
	
	public static void pause() {
		System.out.println("Pause");
		isRunning = false;		
	}
	
	public static void resume() {
		System.out.println("Resume");
		isRunning = true;		
	}
	
	public static void query() {
		System.out.println("Query");
		webSocket.sendMessage("seconds " + (isRunning ? timerInSeconds : 0));		
	}
	
	public static void start(int seconds) {
		System.out.println("Start");
		stopSound();
		if (timerWindow == null) {
			timerInSeconds = seconds;
			
			timerWindow = new JFrame("Dream Room Timer");

			JPanel panel = new JPanel();
			panel.setLayout(new BorderLayout(5,5));

			timerButton = new JButton();
			
			timerButton.setText("");
			timerButton.setContentAreaFilled(true);
			timerButton.setOpaque(true);
			timerButton.setForeground(Color.BLACK);
			timerButton.setBackground(Color.WHITE);

			panel.add(timerButton, BorderLayout.CENTER);

			timerWindow.add(panel);
			timerWindow.setSize(300, 300);
		
			timerWindow.setLocationRelativeTo(null);
			timerWindow.setVisible(true);
			
			setTimerFontSize(timerButton, "-99:99");	
			
			timerWindow.setAlwaysOnTop(true);
			timerWindow.setLocation(0, 0);		
			timerWindow.setDefaultCloseOperation(0);
		} else {
			timerInSeconds += seconds;

			timerWindow.setVisible(true);
			
			timerWindow.setAlwaysOnTop(true);
			timerWindow.setLocation(0, 0);		
		}
		isRunning = true;		
	}
	
	public static void timeout(final String workstation) {
		(new Thread() {
		    public void run(){
				if (soundClip == null) {
					playSound(true);
				}
				JFrame tmpFrame = new JFrame("");
				
				tmpFrame.setAlwaysOnTop(true);
				
				JOptionPane.showMessageDialog(tmpFrame, "Puesto: " + workstation, "Tiempo Finalizado", JOptionPane.INFORMATION_MESSAGE);
				
				tmpFrame.dispose();
				stopSound();
		    }
		 }).start();
	}
	
	public static void setTimerFontSize(JButton button, String text) {
		Font   labelFont = button.getFont();
		String labelText = text;

		int stringWidth = button.getFontMetrics(labelFont).stringWidth(labelText);
		int componentWidth = button.getWidth();

		// Find out how much the font can grow in width.
		double widthRatio = (double)componentWidth / (double)stringWidth;

		int newFontSize = (int)(labelFont.getSize() * widthRatio);
		int componentHeight = button.getHeight();

		// Pick a new font size so it will not be larger than the height of label.
		int fontSizeToUse = Math.min(newFontSize, componentHeight);

		// Set the label's font size to the newly determined size.
		button.setFont(new Font(labelFont.getName(), Font.PLAIN, fontSizeToUse - 20));
	}
	
	public static String readFileAsString(String fileName, String charsetName)
		    throws java.io.IOException {
		  java.io.InputStream is = new java.io.FileInputStream(fileName);
		  try {
		    final int bufsize = 4096;
		    int available = is.available();
		    byte[] data = new byte[available < bufsize ? bufsize : available];
		    int used = 0;
		    while (true) {
		      if (data.length - used < bufsize) {
		        byte[] newData = new byte[data.length << 1];
		        System.arraycopy(data, 0, newData, 0, used);
		        data = newData;
		      }
		      int got = is.read(data, used, data.length - used);
		      if (got <= 0) break;
		      used += got;
		    }
		    return charsetName != null ? new String(data, 0, used, charsetName)
		                               : new String(data, 0, used);
		  } finally {
		    is.close();
		  }
		}
	
	public static void main(String args[]) {

		String url = "";
		
		try {
			UIManager.setLookAndFeel(new MetalLookAndFeel());
			
			//url = (new String(Files.readAllBytes(Paths.get("TimerUrl.txt")))).split(" ")[0];
			url = readFileAsString("TimerUrl.txt", null).split(" ")[0];
			
			System.out.println("URL=" + url);
		} catch (Exception ex) {};

		String branch 		= args[0];
		String workstation 	= args[1];
		
		webSocket = TimerWebSocket.start(url, branch, workstation);
		
		try {
			while (true) {
				Thread.currentThread().sleep(1000);
				if (isRunning) {
					timerInSeconds--;
					
					int minutes = Math.abs(timerInSeconds / 60);
					int seconds = Math.abs(timerInSeconds % 60);
					
					if (timerInSeconds == 0) {
						timerButton.setForeground(Color.WHITE);
						timerButton.setBackground(Color.RED);	
						webSocket.sendMessage("timeout");
						playSound(false);
					} else if (timerInSeconds == 30) {
						timerButton.setForeground(Color.WHITE);
						timerButton.setBackground(Color.ORANGE);
						playSound(false);
					} else if (timerInSeconds == 60) {
						timerButton.setForeground(Color.WHITE);
						timerButton.setBackground(Color.GREEN);
					} else if (timerInSeconds == -30) {
						playSound(true);						
					} 
					
					timerButton.setText("" + (timerInSeconds < 0 ? "-" : "") + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
				}
				
			}
		} catch (Exception ex) {};
	}

}
