//
//  ViewController.h
//  xyRobot
//
//  Created by local on 7/8/16.
//  Copyright © 2016 binaryfutures. All rights reserved.
//

#import "HTTPServer.h"
#import "DDLog.h"
#import "DDTTYLogger.h"
#import <Cocoa/Cocoa.h>
#import "xyRobotHTTPConnection.h"
#import "ImageProcessor.h"
@class HTTPServer;

@interface ViewController : NSViewController

@property (strong,nonatomic)HTTPServer *httpServer;
@property (strong,nonatomic)ImageProcessor* imageProcessor;
@property (strong,nonatomic)IBOutlet NSImageView* viewOriginalImage;
-(void)startHTTPServer;
-(void)gotImageToPrint:(NSNotification*)notification;
@end

