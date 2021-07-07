#import "LastActiveState.h"
#import <React/RCTUtils.h>

static NSString *RCTCurrentAppState()
{
  static NSDictionary *states;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    states = @{@(UIApplicationStateActive) : @"active", @(UIApplicationStateBackground) : @"background"};
  });

  if (RCTRunningInAppExtension()) {
    return @"extension";
  }

  return states[@(RCTSharedApplication().applicationState)] ?: @"unknown";
}

@implementation LastActiveState {
    int _lastActiveTime;
    NSString *_lastKnownState;
}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(getLastActiveTime : (RCTResponseSenderBlock)callback)
{
 NSInteger result = [self getLastActiveTime];
 callback(@[ @(result) ]);
}

- (NSDictionary *)constantsToExport
{
 return @{ @"initialLastActiveTime": @([self getLastActiveTime]) };
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[ @"changeLastActiveTime" ];
}

- (void)startObserving
{
  NSLog(@"Start observing");
  for (NSString *name in @[
         UIApplicationDidBecomeActiveNotification,
         UIApplicationDidEnterBackgroundNotification,
         UIApplicationDidFinishLaunchingNotification,
         UIApplicationWillResignActiveNotification,
         UIApplicationWillEnterForegroundNotification
       ]) {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(handleAppStateDidChange:)
                                                 name:name
                                               object:nil];
  }
}

- (void)stopObserving
{
  NSLog(@"stop observing");
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)handleAppStateDidChange:(NSNotification *)notification
{
  NSString *newState;

  if ([notification.name isEqualToString:UIApplicationWillResignActiveNotification]) {
    newState = @"inactive";
  } else if ([notification.name isEqualToString:UIApplicationWillEnterForegroundNotification]) {
    newState = @"background";
  } else {
    newState = RCTCurrentAppState();
  }
  
  if (![newState isEqualToString:_lastKnownState]) {
     _lastKnownState = newState;
     if (self.bridge && [newState isEqualToString:@"active"]) {
       [self sendEventWithName:@"changeLastActiveTime"
                          body:[self getResult:_lastActiveTime]];
     } else {
         [self saveLastActiveTime];
     }
   }
}

- (NSInteger)getLastActiveTime
{
  return [[NSUserDefaults standardUserDefaults] integerForKey:@"lastActiveTime"];
}

- (id)getResult:(NSInteger)time
{
  return  @{@"lastActiveTime" : @(time)};
}

- (void)saveLastActiveTime
{
  int time = [[NSDate date] timeIntervalSince1970];
  [[NSUserDefaults standardUserDefaults] setInteger:time
                                            forKey:@"lastActiveTime"];
  _lastActiveTime = time;
}

@end
