describe('ClientJS', function () {
  var client;
  beforeEach(function () {
    client = new ClientJS();
  });

  it('should initialize an instance', function () {
    expect(client).not.toBeNull();
  });

  describe('#getDefaultOptions', function () {
    it('should successfully call each method', function(){
      var options = client.getDefaultOptions();
      for(o in options) {
        expect(client[o]).not.toBeUndefined()
      }
    });
  });

  describe('#extendOptions', function () {
    it('should update source object', function(){
      var source = {
            false: false,
            true: true
          },
          target = {
            false: true,
            newVal: 26
          };

      client.extendOptions(source, target)
      expect(source).toEqual(jasmine.objectContaining(target));
      expect(source).toEqual(jasmine.objectContaining({true: true}));
    });
  });

  describe('#getIPAddressesOption', function(){
    it("should not return ip addresses by default", function(done){
      client.getIPAddressesOption(function(ips){
        expect(ips).toBeUndefined();
        done();
      });
    });

    it("should return ip addresses if options.getIPAddresses is truthy", function(done){
      client.options.getIPAddresses = true;
      client.getIPAddressesOption(function(ips){
        expect(ips).not.toBeUndefined();
        done();
      });
    });
  });

  describe('#getMediaDevicesOption', function(){
    it("should not return media devices by default", function(done){
      client.getMediaDevicesOption(function(mediaDevices){
        expect(mediaDevices).toBeUndefined();
        done();
      });
    });

    it("should return ip addresses if options.getIPAddresses is truthy", function(done){
      client.options.getIPAddresses = true;
      client.getIPAddressesOption(function(ips){
        expect(ips).not.toBeUndefined();
        done();
      });
    });
  });

  describe('#getVersion', function () {
    it('should be a string', function () {
      expect(client.getVersion()).toEqual(jasmine.any(String));
    });
  });

  describe('browser parser', function () {
    var browserParser;
    beforeEach(function () {
      browserParser = client.getParser();
    });

    describe('#getParser', function () {
      it('should return a UAParser result', function () {
        var parser = (new (window.UAParser || exports.UAParser));
        expect(browserParser).toEqual(parser.getResult());
      });

      it('should be something', function () {
        expect(browserParser).not.toBeNull();
      });
    });

    describe('#getUserAgent', function () {
      it('should be equal to parser.ua', function () {
        expect(client.getUserAgent()).toEqual(browserParser.ua);
      });
    });

    describe('#getUserAgentLowerCase', function () {
      it('should be equal to client.getUserAgent, but in lower case', function () {
        expect(client.getUserAgentLowerCase()).toEqual(client.getUserAgent().toLowerCase());
      });
    });

    describe('#getBrowser', function () {
      it('should be equal to parser.browser.name', function () {
        expect(client.getBrowser()).toEqual(browserParser.browser.name);
      });
    });

    describe('#getBrowserVersion', function () {
      it('should be equal to parser.browser.version', function () {
        expect(client.getBrowserVersion()).toEqual(browserParser.browser.version);
      });
    });

    describe('#getBrowserMajorVersion', function () {
      it('should be equal to parser.browser.major', function () {
        expect(client.getBrowserMajorVersion()).toEqual(browserParser.browser.major);
      });
    });

    describe("getIPAddresses", function(){
      it("should return valid ips", function(done){
        client.getIPAddresses(function(ipAddresses){
          //reference: http://caniuse.com/#feat=rtcpeerconnection
          if ((client.isChrome() && !client.isMobileIOS()) || client.isFirefox() || (client.isOpera() && !client.isMobile())) {
            expect(ipAddresses).toEqual({
              localAddr: jasmine.stringMatching(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/),
              publicAddr: jasmine.any(String),
              fingerprint: jasmine.any(String)
            });
          } else {
            expect(ipAddresses).toEqual('');
          }

          done();
        });
      });
    });

    describe('#isIE|Chrome|Firefox|Safari|Opera', function () {
      it('should return true with the correct browser', function () {
        var browsers = ['IE', 'Chrome', 'Firefox', 'Safari', 'Opera'];
        for (var i = 0; i < browsers.length; i++) {
          var browser = browsers[i];
          var isBrowser = client['is' + browser]();
          if (client.getBrowser() == browser) {
            expect(isBrowser).toBeTruthy();
          } else if (client.getBrowser() == 'Mobile Safari' && browser == 'Safari') {
            expect(isBrowser).toBeTruthy();
          } else {
            expect(isBrowser).toBeFalsy();
          }
        }
      });
    });

    describe('#getEngine', function () {
      it('should be equal to parser.engine.name', function () {
        expect(client.getEngine()).toEqual(browserParser.engine.name);
      });
    });

    describe('#getEngineVersion', function () {
      it('should be equal to parser.engine.version', function () {
        expect(client.getEngineVersion()).toEqual(browserParser.engine.version);
      });
    });

    describe('#getOS', function () {
      it('should be equal to parser.os.name', function () {
        expect(client.getOS()).toEqual(browserParser.os.name);
      });
    });

    describe('#getOSVersion', function () {
      it('should be equal to parser.os.version', function () {
        expect(client.getOSVersion()).toEqual(browserParser.os.version);
      });
    });

    describe('#getDevice', function () {
      it('should be equal to parser.device.model', function () {
        expect(client.getDevice()).toEqual(browserParser.device.model);
      });
    });

    describe('#getDeviceType', function () {
      it('should be equal to parser.device.type', function () {
        expect(client.getDeviceType()).toEqual(browserParser.device.type);
      });
    });

    describe('#getDeviceVendor', function () {
      it('should be equal to parser.device.vendor', function () {
        expect(client.getDeviceVendor()).toEqual(browserParser.device.vendor);
      });
    });

    describe('#getCPU', function () {
      it('should be equal to parser.cpu.architecture', function () {
        expect(client.getCPU()).toEqual(browserParser.cpu.architecture);
      });
    });

    describe('#getCanvasPrint', function () {
      it('should return a String', function () {
        expect(client.getCanvasPrint()).toEqual(jasmine.any(String));
      });

      it('should generate different canvasPrints', function () {
        var cp1 = client.getCanvasPrint('Fo0!');
        var cp2 = client.getCanvasPrint('BaR?');

        expect(cp1).not.toEqual(cp2);
      });
    });

    describe('#getWebglFingerprint', function () {
      var webglfp;
      it('should return a string', function () {
        webglfp =  client.getWebglFingerprint();
        expect(webglfp).toEqual(jasmine.any(String));
      });
    });

    describe('#getGraphicsDriverVendor', function () {
      var vendor;
      it('should return a string', function () {
        vendor =  client.getGraphicsDriverVendor();
        expect(vendor).toEqual(jasmine.any(String));
      });
    });

    describe('#getGraphicsDriverRenderer', function () {
      var vendor;
      it('should return a string', function () {
        vendor =  client.getGraphicsDriverRenderer();
        expect(vendor).toEqual(jasmine.any(String));
      });
    });

    describe('#getGraphicsDriverInfo', function () {
      var driverInfo;

      it('should contcat vendor and renderer', function () {
        driverInfo =  client.getGraphicsDriverInfo();
        vendorAndRenderer = client.getGraphicsDriverVendor() + ' ' + client.getGraphicsDriverRenderer();

        expect(driverInfo).toEqual(vendorAndRenderer);
      });

      it('should call getGraphicsDriverVendor and getGraphicsDriverRenderer', function () {
        client.getGraphicsDriverVendor = jasmine.createSpy('getGraphicsDriverVendor');
        client.getGraphicsDriverRenderer = jasmine.createSpy('getGraphicsDriverRenderer');
        client.getGraphicsDriverInfo()

        expect(client.getGraphicsDriverVendor).toHaveBeenCalled();
        expect(client.getGraphicsDriverRenderer).toHaveBeenCalled();
      });
    });

    describe('#getMediaDevices', function () {
      var mediaDevices;

      beforeEach(function (done) {
        mediaDevices = client.getMediaDevices(function(md){
          mediaDevices = md;
          done();
        });
      });

      it('should return a string', function () {
        expect(mediaDevices).toEqual(jasmine.any(String));
      });
    });

    describe('#getFingerprint', function () {
      var fp;
      var dp;
      beforeEach(function(done){
        client.getFingerprint({},function (fingerprint, datapoints) {
          fp = fingerprint;
          dp = datapoints;
          done();
        });
      });

      describe('fingerprint', function () {
        it('should return a String', function () {
          expect(fp).toEqual(jasmine.any(String));
        });
      });

      describe('datapoints', function () {
        it('should not include getIPAddresses by default', function () {
          expect(dp.getIPAddresses).toBeUndefined();
        });

        it('should not include getMediaDevices by default', function () {
          expect(dp.getMediaDevices).toBeUndefined();
        });

        it('should include getIPAddresses if added to the options', function (done) {
          client.getFingerprint({getIPAddresses: true},function (fingerprint, datapoints) {
            dp = datapoints;
            expect(dp.getIPAddresses).not.toBeUndefined();
            done();
          });
        });

        it('should include getMediaDevices if added to the options', function (done) {
          client.getFingerprint({getMediaDevices: true},function (fingerprint, datapoints) {
            dp = datapoints;
            expect(dp.getMediaDevices).not.toBeUndefined();
            done();
          });
        });
      });

      describe("similarity", function(){
        it('should be greater than 90 and less than 100 with different user agent', function (done) {
          var newFingerprint;

          client.getUserAgent = jasmine.createSpy().and.returnValue('foo')

          client.getFingerprint({},function (fingerprint, datapoints) {
            newFingerprint = fingerprint;
            var similarity = ctph.similarity(newFingerprint, fp);
            expect(similarity).toBeGreaterThan(90);
            //expect(similarity).toBeLessThan(100); //Opera allways returns 100 here
            done();
          });
        });

        it('should be greater than 17 and less than 35.1 with different canvas fingerprint', function () {
          var vars = {};

          vars.cp1 = client.getCanvasPrint('Fo0!');
          vars.cp2 = client.getCanvasPrint('BaR?');

          for (var i = 1; i <= 2; i++) {
            client.getCanvasPrint = jasmine.createSpy().and.returnValue(vars['cp' + i]);

            client.getFingerprint({}, function (fingerprint, datapoints) {
              vars['fp' + i] = fingerprint;
            });
          }

          var similarity = ctph.similarity(vars.fp1, vars.fp2)
          expect(similarity).toBeGreaterThan(17);
          expect(similarity).toBeLessThan(35.1);
        });

        it('should be greater than 97 and less than 100 with different language', function () {
          var newFingerprint;
          client.getLanguage = jasmine.createSpy().and.returnValue('en');

          client.getFingerprint({}, function (fingerprint, datapoints) {
            newFingerprint = fingerprint;
          });

          var similarity = ctph.similarity(fp, newFingerprint);

          expect(similarity).toBeGreaterThan(97);
          expect(similarity).toBeLessThan(100);
        });

        it('should be greater than 95 and less than 100 with different graphics driver info', function () {
          var newFingerprint;
          client.getGraphicsDriverInfo = jasmine.createSpy().and.returnValue('Graphics Driver Vendor XYZ 1234N Graphics Driver Vendor XYZ 1234N Graphics Driver Vendor XYZ 1234N Graphics Driver Vendor XYZ 1234N Graphics Driver');

          client.getFingerprint({}, function (fingerprint, datapoints) {
            newFingerprint = fingerprint;
            var similarity = ctph.similarity(fp, newFingerprint);

            expect(similarity).toBeGreaterThan(95);
            expect(similarity).toBeLessThan(100);
          });
        });

        it('should be greater than 94 and less than 100 with two media devices more', function (done) {
          var newFingerprint;
          var mediaDevices;

          client.getMediaDevices(function (md) {
            mediaDevices = md;
          });

          client.getMediaDevicesOption = jasmine.createSpy().and.callFake(function(callback){
            callback(mediaDevices + 'audioinput:undefined#17672367228;videoinput:undefined#6909382487');
          });

          client.getFingerprint({},function (fingerprint) {
            newFingerprint = fingerprint;
            var similarity = ctph.similarity(fp, newFingerprint);
            expect(similarity).toBeGreaterThan(94);
            expect(similarity).toBeLessThan(100);
            done()
          });
        });

        it('should be greater than 94 and less than 100 with different media devices', function (done) {
          var newFingerprint;

          client.getMediaDevicesOption = jasmine.createSpy().and.callFake(function(callback){
            callback('videoinput:undefined#EFVEeRjv7CGKNsmS0IyLOMkmlHnYNV8vAmTD8KX+GLg=;audioinput:undefined#V3ZmhtoZdYJDiaTlEDWy+FVvGtbvPOviGvGh3UgEkxk=;audioinput:undefined#kFtf600O1esdlq2m0aam+8EDe+V7TYmX9eZ6FmNAels=;audioinput:undefined#UOePYGe9MR/zaA23ZjSOT3QH1OG63Lz4CW5YfB7lct0=;');
          });

          client.getFingerprint({},function (fingerprint) {
            newFingerprint = fingerprint;
            var similarity = ctph.similarity(fp, newFingerprint);
            expect(similarity).toBeGreaterThan(94);
            expect(similarity).toBeLessThan(100);
            done()
          });
        });
      });
    });
  });
});
