//
//  File.swift
//  WeActiveTribe
//
//  Created by Roberto Franco on 20/01/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation
import UIKit

@objc(ConektaManager)
class ConektaManager: UIViewController {
  private var conekta: Conekta = Conekta();
  
  override func viewDidLoad() {
    self.conekta.delegate = self
    super.viewDidLoad()
  }
  
  @objc
  func createToken(
    _ info: NSDictionary,
    resolver success: @escaping RCTResponseSenderBlock,
    rejecter failure: @escaping RCTResponseSenderBlock
  ) -> Void {
    if let dict = info as NSDictionary? {
      let card: Card = conekta.card()
      
      card.setNumber(
        dict["cardNumber"] as? String,
        name: dict["name"] as? String,
        cvc: dict["cvc"] as? String,
        expMonth: dict["expMonth"] as? String,
        expYear: dict["expYear"] as? String
      )

      let token = conekta.token()

      token!.card = card

      token!.create(success: { (data) -> Void in
          success([data])
      }, andError: { (error) -> Void in
        failure([error as Any])
      })
    } else {
      failure(["Error creating token"])
    }
  }
  
  @objc
  func setPublicKey(_ publicKey: NSString) {
    self.conekta.publicKey = publicKey as String
  }
  
  @objc
  func getPublicKey(_ callback: RCTResponseSenderBlock) {
    callback([self.conekta.publicKey ?? "Not assigned"])
  }
  
  override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
    // Dispose of any resources that can be recreated.
  }
  
}
