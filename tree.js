class Tree {
    constructor() {
        this.root = null; // start empty
    }

    emptyTree() {
        return this.root === null;
    }

    plantTree(num) {
        this.root = new Leaf(num);
    }

    addLeaf(num) {
        // Start a new tree if this is the first leaf
        if (this.emptyTree()) return this.plantTree(num);
        
        // Traverse the tree to recursively sort num relative to parent(s)
        const parent = this.root;

        // Smaller num to the left, recursively
        if (num < parent) {
            // Add to left if there is room, else traverse left branch
            if (parent.tryAddLeft(num)) {
                return;
            } else return this.searchTree(parent.left);
        
        // Larger num to the right, recursively
        } else if (num > parent) {
            // Add to right if there is room, else traverse right branch
            if (parent.tryAddRight(num)) {
                return;
            } else return this.searchTree(parent.right);

        // Disregard duplicate adds        
        } else {
            return null;
        }
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
        if (this.left != null) return false;

        this.left = new Leaf(num);
        return true;
    }

    tryAddRight(num) {
        if (this.right != null) return false;

        this.right = new Leaf(num);
        return true;
    }
}