//
//  Conekta.m
//  WeActiveTribe
//
//  Created by Roberto Franco on 20/01/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_REMAP_MODULE(RNConekta, ConektaManager, NSObject)

RCT_EXTERN_METHOD(setPublicKey: (NSString)publicKey)
RCT_EXTERN_METHOD(createToken:
                  (NSDictionary)info
                  resolver: (RCTResponseSenderBlock)success
                  rejecter: (RCTResponseSenderBlock)failure
                  )
RCT_EXTERN_METHOD(getPublicKey: (RCTResponseSenderBlock)callback)

@end
