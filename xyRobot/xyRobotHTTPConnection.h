//
//  xyRobotHTTPConnection.h
//  xyRobot
//
//  Created by local on 7/8/16.
//  Copyright © 2016 binaryfutures. All rights reserved.
//
#import <Foundation/Foundation.h>

#import "HTTPConnection.h"

@protocol xyRobotConnectionDelegate
@optional
- (void)XYRUploaded:(NSString *)filename;

@end

@class MultipartFormDataParser;

@interface xyRobotHTTPConnection : HTTPConnection
{
    MultipartFormDataParser*        parser;
    NSFileHandle*					storeFile;
    
    NSMutableArray*					uploadedFiles;
}
@property (strong,nonatomic)id delegate;
@end
