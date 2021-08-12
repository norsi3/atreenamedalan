class Tree {
    constructor() {
        this.root = null; // start empty
    }

    append(num) {
        if (this.newTree()) {
            this.root = new Leaf(num)
            // might use return obj to select for animate.js
            return this.root 
        }
        else {

        }
    }

    empty(leaf) {
        return (isNaN(leaf) || (leaf === null));
    }

    newTree() {
        return this.empty(this.root);
    }

    searchTree(num) {
        const parent = this.root.num;

        // Smaller num to the left, recursively
        if (num < parent) {
            if (this.empty(parent.left)) {
                parent.left = new Leaf(num);
                return;
            } else return this.searchTree(parent.left);
        
        // Larger num to the right, recursively
        } else if (num > parent) {
            if (this.empty(parent.right)) {
                parent.right = new Leaf(num);
                return;
            } else return this.searchTree(parent.right);

        // Disregard duplicate adds        
        } else {
            return null;
        }
    }


}

class Leaf {
    constructor(num) {
        this.num = num;
        this.left = null;
        this.right = null;
    }
}