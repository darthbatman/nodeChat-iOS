//
//  ViewController.swift
//  nodeChat-iOS
//
//  Created by Rishi Masand on 3/29/15.
//  Copyright (c) 2015 Rishi Masand. All rights reserved.
//

import UIKit

class ViewController: UIViewController, UITextFieldDelegate {

    
    @IBOutlet weak var textField: UITextField!
    @IBOutlet weak var scrollView: UIScrollView!
    @IBOutlet weak var textView: UITextView!
    
    let socket = SocketIOClient(socketURL: "http://darthbatman.tk");
    
    override func viewDidLoad() {
        textView.editable = true
        textView.font = UIFont(name: "Helvetica", size: 24)
        textView.editable = false
        textView.text = "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
        textField.returnKeyType = UIReturnKeyType.Done
        var length = self.textView.text.utf16Count;
        self.textView.scrollRangeToVisible(NSMakeRange(length, 0));
        
        //var tap = UIGestureRecognizer(target: self.scrollView, action: "dismissKeyboard:")
        self.textField.delegate = self;
        
        //println(self.textView.text.utf16Count);
        super.viewDidLoad()
        self.socket.connect();
        self.socket.on("chat message") {[weak self] data, ack in
            if let msg = data?[0] as? String {
                self?.textView.text = self?.textView.text .stringByAppendingString(msg + "\n");
                println(msg);
                self?.textField.text = ""
                var length = self?.textView.text.utf16Count;
                self?.textView.scrollRangeToVisible(NSMakeRange(length!, 0));
            }
        }
        // Do any additional setup after loading the view, typically from a nib.
    }
    
    func textFieldDidBeginEditing(textField: UITextField) {
        //println("Begin");
        var scrollPoint:CGPoint = CGPointMake(0, (textField.frame.origin.y - 284));
        scrollView.setContentOffset(scrollPoint, animated: true);
        var length = self.textView.text.utf16Count;
        self.textView.scrollRangeToVisible(NSMakeRange(length, 0));
    }
    
    func textFieldDidEndEditing(textField: UITextField) {
        scrollView.setContentOffset(CGPointZero, animated: true);
    }
    
    func dismissKeyboard(recognizer: UITapGestureRecognizer) {
        textField.endEditing(true);
    }
    
    func textFieldShouldReturn(textField: UITextField) -> Bool {
        textField.endEditing(true)
        return false
    }
    
    override func touchesBegan(touches: NSSet, withEvent event: UIEvent) {
        textField.endEditing(true)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func submit(sender: AnyObject) {
        println("Send pressed");
        self.socket.emit("message from mobile", textField.text);

    }
    

}



