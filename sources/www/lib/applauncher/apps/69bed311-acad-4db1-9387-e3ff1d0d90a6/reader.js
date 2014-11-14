function Reader(defaultColor,sound)
{
    this.messages = new Array();
    this.ids = new Array();
    this.colors = new Array();
    this.sounds = new Array();
    this.currentId = null;
    this.mainColor = defaultColor;
    this.playSound = sound;
    
    
    /**
     * Clear messages to read
     */
    this.clear = function()
    {
        this.messages = new Array();
        this.ids = new Array();
        this.colors = new Array();
        this.sounds = new Array();
        this.currentId = null;
    }
    
    
    /**
     * Add new message to read
     */
    this.add = function(message, id, color, sound)
    {
        this.messages.push(message);
        this.ids.push(id);
        this.colors.push(color);
        this.sounds.push(sound);
    }

    
    /**
     * Read next message
     * @param nextCallback function to call after reading
     * @return if of read message
     */
    this.readNext = function(nextCallback)
    {
        log("read next");
        if (this.messages.length > 0)
        {
            var msg = this.messages.shift();
            var color = this.colors.shift();
            var sound = this.sounds.shift();
            this.currentId = this.ids.shift();

            this.read(msg, color, sound, nextCallback);
            return this.currentId;
        }
        
        return null;
    }
    
    this.read = function(text, color, sound, callback)
    {
        if (color != null && color != "")
        {
            karotz.led.light(color);
        }
        
        if (this.playSound && sound != null && sound != "")
        {
            karotz.chain.play(sound).tts(text, "fr").exec(function() { callback("TERMINATED"); });
        }
        else
        {
            karotz.tts.start(text, "fr", callback);
        }
    }
}
