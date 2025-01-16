'use client';

export default function SmartSuppScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          var _smartsupp = _smartsupp || {};
          _smartsupp.key =  '4ce7b1c0e9bc883413ea12ae3434c19a83a3751e';
          _smartsupp.offsetY = 100;
          _smartsupp.privacyNoticeEnabled = true; 
          _smartsupp.ratingEnabled = true;
_smartsupp.privacyNoticeUrl = "https://www.coinspectrum.net"; 
_smartsupp.privacyNoticeCheckRequired = true;
_smartsupp.backgroundColor = 'transparent';
          window.smartsupp||(function(d) {
            var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
            s=d.getElementsByTagName('script')[0];c=d.createElement('script');
            c.type='text/javascript';c.charset='utf-8';c.async=true;
            c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
          })(document);
          
          smartsupp('chat:widget', {
            buttonStyle: 'background: none; border: none; width: 60px; height: 60px;',
          });
        `,
      }}
    />
  );
}
