//
//  ImageProcessor.h
//  xyRobot
//
//  Created by local on 7/8/16.
//  Copyright © 2016 binaryfutures. All rights reserved.
//


#import <Foundation/Foundation.h>
#import "ORSSerialPort.h"
#import <AppKit/AppKit.h>

@interface ImageProcessor : NSImageView
@property (strong, nonatomic) NSImage* imageToPrint;
@property (strong,nonatomic)  ORSSerialPort *serialPort;

-(id)initWithFrame:(NSRect)frameRect;
-(void)uploadedImage:(NSNotification*)notification;
+(NSImage*)loadImage:(NSString *)path;

@end
