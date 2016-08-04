//
//  NotificationManager.h
//  xyRobot
//
//  Created by local on 7/8/16.
//  Copyright © 2016 binaryfutures. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NotificationManager : NSObject
+(id)sharedManager;
-(void)notifyUploadWithFileName:(NSString*)string;
@end
