
import java.awt.FlowLayout;

import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.Clip;
import javax.swing.*;
import javax.swing.plaf.metal.MetalLookAndFeel;

import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.File;

public class TimeController implements KeyEventDispatcher {

	final static int ACTION_NONE  		= 0;
	final static int ACTION_START 		= 1;
	final static int ACTION_PAUSE 		= 2;
	final static int ACTION_END   		= 3;
	
	static int 		action = ACTION_NONE;
	static String 	actionKey = "";
	static boolean  isRunning = false;
	
	static JFrame   timerWindow    = null;
	static JFrame   timerFrame     = null;
	static JButton  timerButton    = null;
	static int      timerInSeconds = 600;
	
	public static void playSound(boolean repeat) {
	    try {
	        AudioInputStream audioInputStream = AudioSystem.getAudioInputStream(new File("Timer.wav").getAbsoluteFile());
	        Clip clip = AudioSystem.getClip();
	        clip.open(audioInputStream);
	        if (repeat) {
	        	clip.loop(Clip.LOOP_CONTINUOUSLY);
	        }
	        clip.start();
	    } catch(Exception ex) {
	        System.out.println("Error with playing sound.");
	        ex.printStackTrace();
	    }
	}
	
	public boolean dispatchKeyEvent(KeyEvent e) {
        if (e.getID() == KeyEvent.KEY_PRESSED) {
        	System.out.println("KeyPressed");
    		if (e.isShiftDown() && e.isControlDown()) {
    			actionKey = "";
    			switch (e.getKeyCode()) {
    				case KeyEvent.VK_S:
    					action = ACTION_START;
    				break;
    				case KeyEvent.VK_P:
    					action = ACTION_PAUSE;
    				break;
    				case KeyEvent.VK_E:
    					action = ACTION_END;
    				break;
    				case KeyEvent.VK_T:
    					playSound(false);
    				break;
    			}
    		}
       } else if (e.getID() == KeyEvent.KEY_RELEASED) {
        } else if (e.getID() == KeyEvent.KEY_TYPED) {
    		if (action != ACTION_NONE) {
    			if (e.getKeyChar() >= '0' && e.getKeyChar() <= '9') {
    				actionKey += "" + e.getKeyChar();
    				
    				if (actionKey.equals("639")) {
    					switch (action) {
    						case ACTION_START:
    							System.out.println("Start");
    							if (timerWindow == null) {
    								timerFrame.dispose();
    								
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
    							}
    							isRunning = true;
    						break;
    						case ACTION_PAUSE:
    							System.out.println("Pause");
    							isRunning = false;
    						break;
    						case ACTION_END:
    							System.out.println("End");
    							System.exit(0);
    						break;
    					}
    				}
    			}
    		}
        }
        return false;
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
	
	public static void selectTime() {

		JComboBox combo = new JComboBox();
		
		for (int i = 10; i <= 60; i += 5) {
			combo.addItem("" + i);
		}
		
		// Accion a realizar cuando el JComboBox cambia de item seleccionado.
		combo.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				System.out.println(combo.getSelectedItem().toString());
				timerInSeconds = Integer.parseInt(combo.getSelectedItem().toString()) * 60;
			}
		});

		// Creacion de la ventana con los componentes
		timerFrame = new JFrame();
		timerFrame.getContentPane().setLayout(new FlowLayout());
		timerFrame.getContentPane().add(combo);
		timerFrame.pack();
		timerFrame.setVisible(true);
		timerFrame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
		timerFrame.setAlwaysOnTop(true);

		Dimension dim = Toolkit.getDefaultToolkit().getScreenSize();
		timerFrame.setLocation(dim.width/2-timerFrame.getSize().width/2, dim.height/2-timerFrame.getSize().height/2);
		
        combo.removeKeyListener(combo.getKeyListeners()[0]); 
	}
	
	public static void main(String s[]) {

		try {
			UIManager.setLookAndFeel(new MetalLookAndFeel());
		} catch (Exception ex) {};
		
		selectTime();
		
        KeyboardFocusManager manager = KeyboardFocusManager.getCurrentKeyboardFocusManager();
        manager.addKeyEventDispatcher(new TimeController());
        
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
