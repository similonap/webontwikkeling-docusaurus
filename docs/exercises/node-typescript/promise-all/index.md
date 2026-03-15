### Promise All

Na hoeveel tijd zal deze code "done!" op het scherm tonen? Voer de code dus niet uit maar denk even zelf na.

```
const delay = (delay: number): Promise&lt;void> => &#123;
    return new Promise((resolve, reject) => &#123;
        setTimeout(() => &#123;
            resolve();
        &#125;, delay);
    &#125;);
&#125;

(async() => &#123;
    await Promise.all([delay(1000), delay(10000), delay(15000)])
    console.log("Done!");
&#125;)();
```