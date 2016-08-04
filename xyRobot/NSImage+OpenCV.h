//
//  NSImage+OpenCV.h
//  xyRobot
//
//  Created by local on 7/11/16.
//  Copyright © 2016 binaryfutures. All rights reserved.
//


#import <opencv2/core/core.hpp>
#include <opencv2/opencv.hpp>
#import <AppKit/AppKit.h>
//-------------------------------------------------------------- UTILS NSIMAGE_OPENCV
@interface NSImage (NSImage_OpenCV) {
    
}

+(NSImage*)imageWithCVMat:(const cv::Mat&)cvMat;
-(id)initWithCVMat:(const cv::Mat&)cvMat;
+(CGImageRef) CGImageCreateWithNSImage:(NSImage*) image;
@property(nonatomic, readonly) cv::Mat CVMat;
@property(nonatomic, readonly) cv::Mat CVGrayscaleMat;

@end