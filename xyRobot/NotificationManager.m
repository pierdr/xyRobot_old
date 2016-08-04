//
//  NotificationManager.m
//  xyRobot
//
//  Created by local on 7/8/16.
//  Copyright © 2016 binaryfutures. All rights reserved.
//

#import "NotificationManager.h"

@implementation NotificationManager
+ (id)sharedManager {
    
    static NotificationManager *sharedMyManager = nil;
    
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedMyManager = [[self alloc] init];
    });
    return sharedMyManager;
}

- (id)init {
    
    
    return self;
}
-(void)notifyUploadWithFileName:(NSString*)string andFilePath:(NSString*)path
{
     NSDictionary* userInfo=[NSDictionary dictionaryWithObjectsAndKeys:string,@"filename", nil];
    [[NSNotificationCenter defaultCenter] postNotificationName:@"test" object:self userInfo:userInfo];
}
@end
