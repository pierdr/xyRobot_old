
//  ImageProcessor.m
//  xyRobot
//
//  Created by local on 7/8/16.
//  Copyright © 2016 binaryfutures. All rights reserved.
//

#define CA_DEBUG_TRANSACTIONS 1
#import <opencv2/core/core.hpp>
#include <opencv2/opencv.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#import "NSImage+OpenCV.h"


#import <Cocoa/Cocoa.h>
#import "ImageProcessor.h"


@implementation ImageProcessor
-(id)initWithFrame:(NSRect)frameRect{
    self=[super initWithFrame:frameRect];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(uploadedImage:) name:@"upload" object:nil];
    return self;
}
-(void)uploadedImage:(NSNotification*)notification{
  
    if([[notification.userInfo allKeys] containsObject:@"name"])
    {
        NSString* filepath=[notification.userInfo valueForKey:@"path"];
        NSLog(@"uploaded %@",filepath);
        NSArray *stringSplit = [[notification.userInfo valueForKey:@"name"] componentsSeparatedByString:@"."];
        NSLog(@"%@,%@",[stringSplit objectAtIndex:0],[stringSplit objectAtIndex:1]);
        
        
        
        NSImage* imageToPrint1 = [ImageProcessor loadImage:filepath];
        if([[imageToPrint1 representations] count]>0)
        {
            
        
            cv::Mat cvMat_original;
            cvMat_original = [imageToPrint1 CVMat];
            cv::Mat cvMat_BW;
            cv::cvtColor(cvMat_original, cvMat_BW, cv::COLOR_BGR2GRAY);
            
            
            IplImage tmp=cvMat_BW;
            
           // cvAdaptiveThreshold(&tmp, &tmp, 255,cv::ADAPTIVE_THRESH_GAUSSIAN_C);
            cvThreshold(&tmp, &tmp, 128, 255, cv::THRESH_BINARY);
          //  cv::Mat cvMat_thresholded= cv::cvarrToMat(&tmp);
    //        cvCanny(&tmp, &tmp, 50, 175);
     //       std::vector<std::vector<Point> > contours;
      //      std::vector<cv::Vec4i> hierarchy;
            CvMemStorage *mem;
            mem = cvCreateMemStorage(0);
            CvSeq *contoursSeq = 0;
            cvShowImage( "Image view", &tmp );
           int i= cvFindContours(&tmp, mem, &contoursSeq);
            NSLog(@"found: %d",i);
            cv::Scalar colors[3];
            colors[0] = cv::Scalar(255, 0, 0);
            colors[1] = cv::Scalar(0, 255, 0);
            colors[2] = cv::Scalar(0, 0, 255);
            
            IplImage cont=cvMat_original;
            cvSet(&cont, cvScalar(0,0,0));
            for (size_t idx = 0; idx < i; idx++) {

                cvDrawContours(&cont, contoursSeq, colors[idx%3], cv::Scalar(255,255,0), 128);
            }
            cv::Mat cvMat_thresholded= cv::cvarrToMat(&cont);
           
            //            cvFindContours( &tmp, contours, hierarchy, CV_RETR_TREE, CV_CHAIN_APPROX_SIMPLE,cvPoint(0, 0) );
            [self setImage:[[NSImage alloc] initWithCVMat:cvMat_thresholded]];
            
        }
        else
        {
            
        }
    }
    //
}


+ (NSImage *)loadImage:(NSString *)path {
    NSArray *imageReps = [NSBitmapImageRep imageRepsWithContentsOfFile:path];
    NSInteger width = 0;
    NSInteger height = 0;
    for (NSImageRep * imageRep in imageReps) {
        if ([imageRep pixelsWide] > width) width = [imageRep pixelsWide];
        if ([imageRep pixelsHigh] > height) height = [imageRep pixelsHigh];
    }
    NSImage *imageNSImage = [[NSImage alloc] initWithSize:NSMakeSize((CGFloat)width, (CGFloat)height)];
    [imageNSImage addRepresentations:imageReps];
    return imageNSImage;
}

@end


#pragma mark NSIMAGE_OPENCV





