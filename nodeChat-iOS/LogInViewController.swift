//
//  LogInViewController.swift
//  nodeChat-iOS
//
//  Created by Rishi Masand on 3/29/15.
//  Copyright (c) 2015 Rishi Masand. All rights reserved.
//

import UIKit

class LogInViewController: UIViewController {
    
    @IBOutlet weak var username: UITextField!
    @IBOutlet weak var password: UITextField!
    
    var socket = SocketIOClient(socketURL: "http://darthbatman.tk")
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        self.socket.connect()
        let vc: UIViewController = self.storyboard?.instantiateViewControllerWithIdentifier("ChatController") as UIViewController
        self.socket.on("Login Successful") {[weak self] data, ack in
            println("Login was successful.")
            self?.presentViewController(vc, animated: true, completion: nil)
        }

    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func LogIn(sender: AnyObject) {
        socket.emit("Login Attempt", username.text, password.text)
    }
    
}
