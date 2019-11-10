var jimp = require('jimp');
var distance = require('euclidean-distance')

function closeMean(pixel, means) {
    var closeIndex = 0;
    var close = distance(pixel, means[0]);
    for (var i = 1; i < means.length; i++)
    {
        var check = distance(pixel, means[i]);
        if (check < close)
        {
            closeIndex = i;
            close = check;
        }
    }
    return closeIndex;

}

function averageValue(arr) {
    var count = arr.length;
    var red = 0;
    var green = 0;
    var blue = 0;
    var alpha = 0;
    for (var i = 0; i < count; i++)
    {
        red += arr[i][0];
        green += arr[i][1];
        blue += arr[i][2];
        alpha += arr[i][3];
    }
    red = Math.floor(red/count);
    blue = Math.floor(blue/count);
    green = Math.floor(green/count);
    alpha = Math.floor(alpha/count);
    return [red,green,blue,alpha]
}

async function kmeans(img, k, output) {
    var image = await jimp.read(img)
    var width = image.bitmap.width
    var height = image.bitmap.height
    console.log(width)
    console.log(height)
    means = []
    closest = []

    var pixels = []

    image.scan(0,0, width, height, function(x,y,idx) {
        var red = this.bitmap.data[idx + 0];
        var green = this.bitmap.data[idx + 1];
        var blue = this.bitmap.data[idx + 2];
        var alpha = this.bitmap.data[idx + 3];
        var arr = [red,green,blue,alpha];
        pixels.push(arr);
        //console.log(arr)
    })

    var totalPixels = width * height
    for (var i = 0; i < k; i ++)
    {
        var index = Math.floor(Math.random()*totalPixels)
        means.push(pixels[index])
        closest.push([])
    }
    console.log(means)
    //console.log(averageValue(pixels))
    var changed = true;
    var checkCount = 0;
    while(changed && checkCount < 100)
    {
        for(var i = 0; i < totalPixels; i++)
        {
            closest[closeMean(pixels[i],means)].push(pixels[i])
        }
        changed = false;
        console.log("checking if change ", checkCount);
        var newCheck = 0;
        for (var i = 0; i < means.length; i++)
        {
            newCheck += closest[i].length
        }
        console.log(newCheck)
        for(var i = 0; i < means.length; i++)
        {
            var newVal = means[i];
            if (closest[i].length > 0)
            {
                var val = averageValue(closest[i])
                newVal = val;
            }
            if (newVal[0] != means[i][0] || newVal[1] != means[i][1] || newVal[2] != means[i][2] || newVal[3] != means[i][3])
            {
                means[i] = newVal;
                changed = true;
            }
            closest[i] = []
        }
        checkCount++
    }
    console.log("finished")
    console.log(means)
    image.scan(0,0, width, height, function(x,y,idx) {
        var red = this.bitmap.data[idx + 0];
        var green = this.bitmap.data[idx + 1];
        var blue = this.bitmap.data[idx + 2];
        var alpha = this.bitmap.data[idx + 3];
        var arr = [red,green,blue,alpha];
        var replace = means[closeMean(arr,means)];
        this.bitmap.data[idx + 0] = replace[0];
        this.bitmap.data[idx + 1] = replace[1];
        this.bitmap.data[idx + 2] = replace[2];
        this.bitmap.data[idx + 3] = replace[3];
        //console.log(arr)
    })
    image.write(output)
    return image;




}

async function main()
{
    var test = await kmeans("panda.png",10, "kpanda.png")
}

main()