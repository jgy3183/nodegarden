var pixelRatio = window.devicePixelRatio
var wWidth
var wHeight
var wArea

var nodes = new Array(Math.sqrt(wArea) / 10 | 0)

var canvas = document.createElement('canvas')
var ctx = canvas.getContext('2d')

var $container = document.getElementById('container')

if (pixelRatio !== 1) {
    // if retina screen, scale canvas
    canvas.style.transform = 'scale(' + 1 / pixelRatio + ')'
    canvas.style.transformOrigin = '0 0'
}
canvas.id = 'nodegarden'

$container.appendChild(canvas)

init()
render()

window.addEventListener('resize', init)
function addNode() {
   //add a node to the canvas
    wWidth = window.innerWidth * pixelRatio
    wHeight = window.innerHeight * pixelRatio
    wArea = wWidth * wHeight

    var newNode = {
        x: Math.random() * wWidth,
        y: Math.random() * wHeight,
        vx: Math.random() * 1 - 0.5,
        vy: Math.random() * 1 - 0.5,
        m: Math.random() * 1.5 + 1,
        link: null,
        pos: false
    }

    nodes.push(newNode);

   // console.log('pushing node: new node array length: ' + nodes.length);

}

canvas.addEventListener('click', function (e) {
    addNode();
    getCursorPosition(this,e);
})


function init() {
    wWidth = window.innerWidth * pixelRatio
    wHeight = window.innerHeight * pixelRatio
    wArea = wWidth * wHeight

    // calculate nodes needed
    nodes.length = Math.sqrt(wArea) / 25 | 0

    // set canvas size
    canvas.width = wWidth
    canvas.height = wHeight

    // create nodes
    var i, len
    for (i = 0, len = nodes.length; i < len; i++) {
        if (nodes[i]) {
            continue
        }
        var newNode = {
            x: Math.random() * wWidth,
            y: Math.random() * wHeight,
            vx: Math.random() * 1 - 0.5,
            vy: Math.random() * 1 - 0.5,
            m: Math.random() * 1.5 + 1,
            link: null,
            pos: false
        }
        //nodes[i] = newNode;
        nodes[i] = newNode;



        // addNode();
    }
}

function render() {
    var distance
    var direction
    var force
    var xForce, yForce
    var xDistance, yDistance
    var i, j, nodeA, nodeB, len

    // request new animationFrame
    requestAnimationFrame(render)

    // clear canvas
    ctx.clearRect(0, 0, wWidth, wHeight)

    // update links
    for (i = 0, len = nodes.length - 1; i < len; i++) {
        for (j = i + 1; j < len + 1; j++) {
            nodeA = nodes[i]
            nodeB = nodes[j]
            xDistance = nodeB.x - nodeA.x
            yDistance = nodeB.y - nodeA.y

            // calculate distance
            distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))

            if (distance < nodeA.m / 2 + nodeB.m / 2) {
                // collision: remove smaller or equal
                if (nodeA.m <= nodeB.m) {
                    nodeA.x = Math.random() * wWidth
                    nodeA.y = Math.random() * wHeight
                    nodeA.vx = Math.random() * 1 - 0.5
                    nodeA.vy = Math.random() * 1 - 0.5
                    nodeA.m = Math.random() * 1.5 + 1
                }

                if (nodeB.m <= nodeA.m) {
                    nodeB.x = Math.random() * wWidth
                    nodeB.y = Math.random() * wHeight
                    nodeB.vx = Math.random() * 1 - 0.5
                    nodeB.vy = Math.random() * 1 - 0.5
                    nodeB.m = Math.random() * 1.5 + 1
                }
                continue
            }

            if (distance > 200) {
                // distance over 200 pixels - ignore gravity
                continue
            }

            // calculate gravity direction
            direction = {
                x: xDistance / distance,
                y: yDistance / distance
            }

            // calculate gravity force
            force = (10 * nodeA.m * nodeB.m) / Math.pow(distance, 2)

            if (force > 0.025) {
                // cap force to a maximum value of 0.025
                force = 0.025
            }

            // draw gravity lines
            ctx.beginPath()
            ctx.strokeStyle = 'rgba(63,63,63,' + force * 40 + ')'
            ctx.moveTo(nodeA.x, nodeA.y)
            ctx.lineTo(nodeB.x, nodeB.y)
            ctx.stroke()

            xForce = force * direction.x
            yForce = force * direction.y

            // calculate new velocity after gravity
            if (nodeA.pos !== nodeB.pos) {
                nodeA.vx -= xForce
                nodeA.vy -= yForce

                nodeB.vx += xForce
                nodeB.vy += yForce
            } else {
                nodeA.vx += xForce
                nodeA.vy += yForce

                nodeB.vx -= xForce
                nodeB.vy -= yForce
            }
        }
    }
    // update nodes
    for (i = 0, len = nodes.length; i < len; i++) {
        drawNode(nodes[i]);
    }
}

function drawNode(node){
    ctx.beginPath()
    ctx.arc(node.x, node.y,node.m, 0, 2 * Math.PI)
    ctx.fill()

    node.x += node.vx
    node.y += node.vy

    if (node.x > wWidth + 25 || node.x < -25 || node.y > wHeight + 25 || node.y < -25) {
        // if node over screen limits - reset to a init position
        node.x = Math.random() * wWidth
        node.y = Math.random() * wHeight
        node.vx = Math.random() * 1 - 0.5
        node.vy = Math.random() * 1 - 0.5
    }
}
//jgy3183
function getCursorPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
}
