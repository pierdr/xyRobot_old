//
//  ViewController.m
//  xyRobot
//
//  Created by local on 7/8/16.
//  Copyright © 2016 binaryfutures. All rights reserved.
//

#import "ViewController.h"
#import "NotificationManager.h"
@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [DDLog addLogger:[DDTTYLogger sharedInstance]];
    [self startHTTPServer];
    _imageProcessor = [[ImageProcessor alloc] initWithFrame:NSMakeRect(340  , 20, 300, 350)];
    [self.view addSubview:_imageProcessor];
     [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(uploadedImage:) name:@"upload" object:nil];
}
-(void)uploadedImage:(NSNotification*)notification{
    
    if([[notification.userInfo allKeys] containsObject:@"name"])
    {
        NSString* filepath=[notification.userInfo valueForKey:@"path"];
        NSLog(@"uploaded %@",filepath);
        NSArray *stringSplit = [[notification.userInfo valueForKey:@"name"] componentsSeparatedByString:@"."];
        NSLog(@"%@,%@",[stringSplit objectAtIndex:0],[stringSplit objectAtIndex:1]);

        NSImage* originalImage = [ImageProcessor loadImage:filepath];
        [_viewOriginalImage setImage:originalImage];
    }
}

- (void)setRepresentedObject:(id)representedObject {
    [super setRepresentedObject:representedObject];

    // Update the view, if already loaded.
}
-(void)gotImageToPrint:(NSNotification*)notification{
    NSLog(@"uploaded %@",[notification valueForKey:@"filename"]);
}
-(void)startHTTPServer{
    _httpServer = [[HTTPServer alloc] init];
    
    // Tell the server to broadcast its presence via Bonjour.
    // This allows browsers such as Safari to automatically discover our service.
    [_httpServer setType:@"_http._tcp."];
    
    // Normally there's no need to run our server on any specific port.
    // Technologies like Bonjour allow clients to dynamically discover the server's port at runtime.
    // However, for easy testing you may want force a certain port so you can just hit the refresh button.
    
    [_httpServer setPort:8001];
    
    // Serve files from the standard Sites folder
    NSString *docRoot = [[[NSBundle mainBundle] pathForResource:@"index" ofType:@"html" inDirectory:@"web"] stringByDeletingLastPathComponent];
   // DDLogInfo(@"Setting document root: %@", docRoot);
    
    [_httpServer setDocumentRoot:docRoot];
    
    [_httpServer setConnectionClass:[xyRobotHTTPConnection class]];
    
    NSError *error = nil;
    if(![_httpServer start:&error])
    {
        //DDLogError(@"Error starting HTTP Server: %@", error);
    }

}
@end
