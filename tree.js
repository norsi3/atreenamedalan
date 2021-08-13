class Tree {
    constructor() {
        this.root = null; // start empty
    }

    emptyTree() {
        return this.root === null;
    }
    
    insertNum(num) {
        this.root = this.addLeaf(num, this.root);
    }

    plantTree(num) {
        this.root = new Leaf(num);
        return this.root;
    }


    addLeaf(num, root) {
        // Start a new tree if this is the first leaf
        if (this.emptyTree()) { 
            this.plantTree(num);
            return this.root;
        }
        
        // Traverse the tree to recursively sort num relative to parent(s)
        // Smaller num to the left, recursively
        if (num < root.num) {
            // Add to left if there is room, else traverse left branch
            if (this.root.tryAddLeft(num)) {
                return null;
            } else return this.addLeaf(num, root.left);
        
        // Larger num to the right, recursively
        } else if (num > root.num) {
            // Add to right if there is room, else traverse right branch
            if (root.tryAddRight(num)) {
                return null;
            } else return this.addLeaf(num, root.right);

        // Disregard duplicate adds        
        } else {
            return null;
        }
    }

    removeLeaf(num, root=this.root) {
        // Empty root? Return null
        if (typeof(root) !== Leaf) return null;

        // Removing the root node?
        if (num === root.num) {
            // 0-1 children: null or use only existing branch
            if (root.left === null) return root.right;
            if (root.right === null) return root.left;

            // 2 children: set root equal to smallest on right branch
            root = root.right.smallest();
            root.right = this.removeLeaf(root.right, root.num);
        
        // Recursively call removeLeaf on children until num === root.num
        } else if (num < root.num) {
            root.left = this.removeLeaf(root.left, num);
        } else {
            root.right = this.removeLeaf(root.right, num);
        }
    }

    render() {
        // Don't bother if there's nothing there
        if (this.emptyTree()) return;

        // Build tree structure before appending to body
        const body = document.getElementsByTagName("body")[0];
        const tree = document.createElement("div");
        tree.setAttribute("id", "tree");
        
        // Create root
        tree.appendChild(this.root.display());
        // appendChild() for right branches, insertBefore() for left branches


        // Append tree to body
        body.appendChild(tree);
    }



}

class Leaf {
    constructor(num,
                left = null,
                right = null) {
        this.num = num;
        this.left = left;
        this.right = right;
    }

    tryAddLeft(num) {
        if (this.left !== null) return false;
        this.left = new Leaf(num);
        return true;
    }

    tryAddRight(num) {
        if (this.right !== null) return false;
        this.right = new Leaf(num);
        return true;
    }

    smallest() {
        if (this.left === null) return this.num;

        // Recursively calling smallest() on left child if it exists
        return this.left.smallest();
    }

    display() {
        const d = document.createElement("div");
        d.setAttribute("id", this.num + "");
        d.innerHTML = this.num + " ";
        return d;
    }
}

function randomInt(max) {
    return ~~(Math.random()*max);
}
function randomTree() {
    const rt = new Tree();
    randomLeaves = [...Array(randomInt(15))].map(leaf=>randomInt(15));

    // Remove duplicates
    randomLeaves = [...new Set(randomLeaves)];
    randomLeaves.forEach(leaf => {
        if (leaf !== 0) {
            rt.insertNum(leaf)
        }
    });

    // Put randomLeaves in order for display as h1
    randomLeaves.sort(function(a, b) { return a - b; });
    const h = document.createElement("h1");
    h.innerHTML = randomLeaves + "";
    document.getElementsByTagName("body")[0].append(h);

    return rt;
}

randomTree().render();