#import <GoogleMaps/GoogleMaps.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@AIzaSyCiVPt3xvlVCL61ZXenr98k5VrvUTb6zJg];
  // ...rest of existing code...
}
@end
