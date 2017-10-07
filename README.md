node-red-node-quantum
=====================

A <a href="http://nodered.org" target="_new">Node-RED</a> node to send QISkit python jobs to the IBM Quantum Experience.

To find out more go to the [IBM Quantum Experience](https://quantumexperience.ng.bluemix.net/qx).

### Pre-requisites

In order for this node to work you need to have installed the
[QISkit python API](https://github.com/QISKit/qiskit-api-py)

This can be installed by either

    sudo easy_install IBMQuantumExperience

or

    sudo pip install IBMQuantumExperience

depending on your platform / flavour of Python - but *please* read their docs at the link above.


### Install

Run the following command in your Node-RED user directory - typically `~/.node-red`

        npm i --save node-red-node-quantum

### Usage

In order to use this node you need an API key. You can this from your Quantum Experience account - under My Account - Personal Access Token.

The editor lets you write or paste in QASM code, for example from the online composer tool.

    OPENQASM 2.0;
    include "qelib1.inc";

    qreg q[5];
    creg c[5];

    h q[0];
    x q[1];
    cx q[0],q[1];
    measure q[0] -> c[0];
    measure q[1] -> c[1];
